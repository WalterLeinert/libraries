import { OnDestroy, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { from, Observable, Subscription } from 'rxjs';

// PrimeNG
import { ConfirmationService } from 'primeng/components/common/api';


// -------------------------------------- logging --------------------------------------------
// tslint:disable-next-line:no-unused-variable
import { getLogger, ILogger, levels, using, XLog } from '@fluxgate/platform';
// -------------------------------------- logging --------------------------------------------

// Fluxgate
import {
  Assert, Core, CustomSubject, Dictionary, Exception, Funktion, IMessage,
  MessageSeverity, ServerBusinessException, Types, UniqueIdentifiable, Utility
} from '@fluxgate/core';

import {
  ColumnMetadata,
  CompoundValidator, CurrentItemSetCommand, CurrentUserStore, EntityVersionCache,
  ICurrentItemServiceState, IEntity, IServiceState,
  IUser, IValidation, ServiceCommand, Store, TableMetadata
} from '@fluxgate/common';


import { IControlDisplayInfo } from '../../../base/displayConfiguration/controlDisplayInfo.interface';
import { DataTypes } from '../../../base/displayConfiguration/dataType';
import { MetadataDisplayInfoConfiguration } from '../../../base/displayConfiguration/metadataDisplayInfoConfiguration';
import { APP_STORE } from '../../redux/app-store';
import { AppInjector } from '../../services/appInjector.service';
import { CurrentUserService } from '../../services/current-user.service';
import { MessageService } from '../../services/message.service';
import { MetadataService } from '../../services/metadata.service';
import { IColumnGroupInfo } from './autoformConfig.interface';
import { FormGroupInfo, IMessageDict } from './formGroupInfo';


export interface IValidatorDict {
  [name: string]: [     // key: Propertyname
    any,                // Propertywert
    ValidatorFn[] | ValidatorFn     // Array von Validatoren
  ];
}


/**
 * Basisklasse (Komponente) ohne Router, Service für alle GUI-Komponenten
 */
export abstract class CoreComponent extends UniqueIdentifiable implements OnInit, OnDestroy {
  protected static readonly logger = getLogger(CoreComponent);

  private static subscriptionMap: Dictionary<UniqueIdentifiable, Subscription[]> =
    new Dictionary<UniqueIdentifiable, Subscription[]>();

  // statisches Set für globale/unique Store-Subscriptions
  private static storeSubscriptions: Set<string> = new Set<string>();

  // TODO: über Language-Service ermitteln
  public static SUCCESS_TEXT = 'Success!';
  public static INFO_TEXT = 'Info';
  public static WARN_TEXT = 'Warning';
  public static ERROR_TEXT = 'Error';

  // >> Formvalidierung
  private formInfos: Dictionary<string, FormGroupInfo> = new Dictionary<string, FormGroupInfo>();
  // << Formvalidierung
  private subscriptions: Subscription[] = [];

  private store: Store;
  private _confirmationService: ConfirmationService;
  private _currentUserService: CurrentUserService;

  protected constructor(private _messageService: MessageService) {
    super();

    this.store = AppInjector.instance.getInstance<Store>(APP_STORE);
    this._confirmationService = AppInjector.instance.getInstance<ConfirmationService>(ConfirmationService);
    this._currentUserService = AppInjector.instance.getInstance<CurrentUserService>(CurrentUserService);

    /**
     * Änderungen am CurrentUserStore global überwachen
     */
    if (!CoreComponent.hasStoreSubscription(CurrentUserStore.ID)) {
      CoreComponent.addStoreSubscription(CurrentUserStore.ID);

      this.getStoreSubject(CurrentUserStore.ID).subscribe((command) => {
        this.onStoreUpdatedGlobal(command);
      });
    }
  }


  /**
   * Init-Methode der Komponente: kann in konkreter Komponente überschrieben werden
   */
  public ngOnInit() {
    using(new XLog(CoreComponent.logger, levels.INFO, 'ngOnInit', `class: ${this.constructor.name}`), (log) => {
      // ok
    });
  }


  /**
   * Destroy-Methode der Komponente: kann in konkreter Komponente überschrieben werden
   */
  public ngOnDestroy() {
    using(new XLog(CoreComponent.logger, levels.INFO, 'ngOnDestroy', `class: ${this.constructor.name}`), (log) => {

      log.log(`unsubscribe store ${this.subscriptions.length} subscriptions`);
      from(this.subscriptions).subscribe((sub) => {
        sub.unsubscribe();
      });

      if (CoreComponent.subscriptionMap.containsKey(this)) {
        if (log.isDebugEnabled()) {
          log.debug(`components registered with subscriptions: ${CoreComponent.subscriptionMap.count}`);
          CoreComponent.subscriptionMap.keys.forEach((key) => {
            const subscriptionsDebug = CoreComponent.subscriptionMap.get(key);
            log.debug(`  key = ${key.constructor.name}: ${subscriptionsDebug.length} subscriptions`);
          });
        }

        // rxjs Subscriptions freigeben
        const subscriptions = CoreComponent.subscriptionMap.get(this);
        Assert.notNullOrEmpty(subscriptions);
        CoreComponent.subscriptionMap.remove(this);

        subscriptions.forEach((item) => {
          item.unsubscribe();
        });
      }
    });
  }


  /**
   * Liefert true, falls eine zugehörige (Reactive) Form existiert und diese dirty ist.
   * Die Form kann aus mehreren FormGroups bestehen.
   * Muss in konkreten Komponentenklassen überschrieben werden, falls zusätzliche Bedingungen greifen sollen.
   *
   * Ist @param{groupName} angegeben, so wird nur die entsprechende Group untersucht.
   *
   * @param groupName - der Name der FormGroup
   * @returns
   */

  public hasChanges(groupName?: string): boolean {
    if (Utility.isNullOrEmpty(groupName)) {
      for (const info of this.formInfos.values) {
        if (info.hasChanges()) {
          return true;
        }
      }
      return false;
    } else {
      return this.formInfos.get(groupName).hasChanges();
    }
  }

  public isValid(groupName?: string): boolean {
    if (Utility.isNullOrEmpty(groupName)) {
      for (const info of this.formInfos.values) {
        if (!info.isValid()) {
          return false;
        }
        return true;
      }
      return false;
    } else {
      return this.formInfos.get(groupName).isValid();
    }
  }


  /**
   * Liefert den Typ eines html-input Fields für die angegebene Info @see{info}
   *
   * @param info
   * @returns
   */
  public getInputType(info: IControlDisplayInfo): string {
    if (info.isSecret) {
      return 'password';
    } else {
      return 'text';
    }
  }


  /**
   * Liefert die Validierungsfehler für das angegebene Control @param{controlName} und die
   * FormGroup @param{groupName}
   *
   * @protected
   * @param controlName
   * @param [groupName=FormGroupInfo.DEFAULT_NAME]
   * @returns
   *
   * @memberOf CoreComponent
   */
  public getFormErrors(controlName: string, groupName: string = FormGroupInfo.DEFAULT_NAME): string {
    Assert.notNullOrEmpty(controlName);
    Assert.notNullOrEmpty(groupName);
    const formInfo = this.formInfos.get(groupName);
    return formInfo.getFormErrors(controlName);
  }


  /**
   * Liefert die default FormGroup
   */
  public get form(): FormGroup {
    return this.getForm();
  }


  /**
   * Liefert die zugehörige @see{FormGroup} für den Namen @param{groupName}.
   *
   * @protected
   * @param [groupName=FormGroupInfo.DEFAULT_NAME]
   * @returns
   */
  public getForm(groupName: string = FormGroupInfo.DEFAULT_NAME): FormGroup {
    Assert.notNullOrEmpty(groupName);
    const formInfo = this.formInfos.get(groupName);
    if (formInfo) {
      return formInfo.form;
    }
    return null;
  }


  /**
   * löscht alle Messages
   */
  protected clearMessages() {
    this._messageService.clearMessage();
  }

  /**
   * fügt eine neue Info-Meldungung hinzu
   *
   * @param text
   * @param [summary='Hinweis']
   */
  protected addSuccessMessage(text: string, summary = CoreComponent.SUCCESS_TEXT) {
    this.addMessage({ severity: MessageSeverity.Success, summary: summary, detail: text });
  }


  /**
   * fügt eine neue Info-Meldungung hinzu
   *
   * @param text
   * @param [summary='Hinweis']
   */
  protected addInfoMessage(text: string, summary = CoreComponent.INFO_TEXT) {
    this.addMessage({ severity: MessageSeverity.Info, summary: summary, detail: text });
  }

  /**
   * fügt eine neue Warn-Meldungung hinzu
   *
   * @param text
   * @param [summary='Hinweis']
   */
  protected addWarnMessage(text: string, summary = CoreComponent.WARN_TEXT) {
    this.addMessage({ severity: MessageSeverity.Warn, summary: summary, detail: text });
  }


  /**
   * fügt eine neue Fehlermeldungung hinzu
   *
   * @param text
   * @param [summary='Fehlermeldung']
   */
  protected addErrorMessage(text: string, summary = CoreComponent.ERROR_TEXT) {
    this.addMessage({ severity: MessageSeverity.Error, summary: summary, detail: text });
  }

  /**
   * fügt eine neue Meldung hinzu
   *
   * @param message
   */
  protected addMessage(message: IMessage) {
    this.messageService.addMessage(message);
  }

  /**
   * Behandelt eine Fehlermeldung
   *
   * @param error
   * @param [summary='Fehlermeldung']
   */
  protected handleError(error: Error, summary?: string) {
    if (error instanceof Exception) {
      if (error.displayed) {
        return;
      }
    }

    if (error instanceof ServerBusinessException) {
      this.addInfoMessage(error.message, summary);
    } else {
      this.addErrorMessage(error.message, summary);
    }

    if (error instanceof Exception) {
      error.displayed = true;
    }
  }


  /**
   * Die rxjs Subscription @param{subscription} für spätere Freigabe registrieren.
   *
   * @param subscription
   */
  protected registerSubscription(subscription: Subscription) {
    Assert.notNull(subscription);

    let subscriptions = CoreComponent.subscriptionMap.get(this);
    if (subscriptions === undefined) {
      subscriptions = [];
      CoreComponent.subscriptionMap.set(this, subscriptions);
    }

    subscriptions.push(subscription);
  }


  /**
   * Erzeugt Displayinfos für das Item @param{item} der Modelklasse @param{model} mit Hilfe der
   * Metadaten @param{metadataService}. Sind @param{propertyName} angegeben, so werden Displayinfos
   * nur für die entsprechenden Properties erzeugt
   *
   * @param item
   * @param model
   * @param metadataService
   * @param propertyNames
   */
  protected createDisplayInfos(item: any, model: Funktion, metadataService: MetadataService, propertyNames?: string[]):
    IControlDisplayInfo[] {
    Assert.notNull(item);
    Assert.notNull(model);
    Assert.notNull(metadataService);

    const tableMetadata = metadataService.findTableMetadata(model);
    const configurator = new MetadataDisplayInfoConfiguration(tableMetadata, metadataService,
      AppInjector.instance.getInjector(), propertyNames);
    return configurator.createConfig(item);
  }


  protected createGroupInfos(tableMetadata: TableMetadata, obj: any, clazz: Funktion,
    metadataService: MetadataService, propertyNames?: string[]) {

    const groupInfos: IColumnGroupInfo[] = [];

    tableMetadata.columnGroupMetadata.forEach((cgm) => {

      let propertyNameSet: Set<string>;

      // entweder alle Properties aus cgm übernehmen oder nur die, die über propertyNames gefiltert sind
      if (Types.isNullOrEmpty(propertyNames)) {
        propertyNameSet = new Set(cgm.columnNames);
      } else {
        propertyNameSet = Utility.intersect(new Set(propertyNames), new Set(cgm.columnNames));
      }


      if (propertyNameSet.size > 0) {
        const displayInfos = this.createDisplayInfos(obj, clazz, metadataService, Utility.toArray(propertyNameSet));

        groupInfos.push({
          columnInfos: displayInfos,
          hidden: false,
          name: cgm.name,
          order: cgm.options.order
        });
      }
    });

    return groupInfos;
  }



  /**
   * Erzeugt mit Hilfe eines @see{FormBuilder}s für die Modelklasse @param{clazz} über die Metadaten
   * und den Injector eine FormGroup @param{groupName} und liefert eine neu erzeugte Modelinstanz.
   *
   * @param formBuilder
   * @param model
   * @param metadataService
   * @param [groupName=FormGroupInfo.DEFAULT_NAME]
   * @returns
   */
  protected buildFormFromModel<T>(formBuilder: FormBuilder, clazz: Funktion, metadataService: MetadataService,
    groupName: string = FormGroupInfo.DEFAULT_NAME, propertyNames?: string[]): T {
    const tableMetadata = metadataService.findTableMetadata(clazz);
    Assert.notNull(tableMetadata, `Metadaten für Tabelle ${clazz.name}`);

    const obj = tableMetadata.createEntity<T>();
    const groupInfos = this.createGroupInfos(tableMetadata, obj, clazz, metadataService, propertyNames);

    this.buildForm(formBuilder, obj, groupInfos, tableMetadata, groupName);

    return obj;
  }


  /**
   * Erzeugt mit Hilfe eines @see{FormBuilder}s für @param{dataItem} und die Infos @param{displayInfos} eine FormGroup
   * und registriert sich auf Formänderungen; über @param{tableMetadata} werden Validierungsinfos aus dem Model besorgt
   *
   * @param formBuilder der zugehörige FormBuilder
   * @param dataItem anzubindendes Datenobjekt
   * @param displayInfos Konfiguration der Controls
   * @param tableMetadata Metadaten
   * @param groupName der Name der FormGroup
   */
  protected buildForm(formBuilder: FormBuilder, dataItem: any, groupInfos: IColumnGroupInfo[],
    tableMetadata: TableMetadata, groupName: string = FormGroupInfo.DEFAULT_NAME): void {
    Assert.notNullOrEmpty(groupName);
    Assert.notNull(formBuilder);
    Assert.notNull(dataItem);
    Assert.notNullOrEmpty(groupInfos);

    using(new XLog(CoreComponent.logger, levels.INFO, 'buildForm'), (log) => {

      //
      // neue FormGroupInfo für form mit Name groupName anlegen und alle Controls
      // mit Validierungsinformationen dort registrieren
      //
      const formInfo = new FormGroupInfo();
      this.formInfos.set(groupName, formInfo);

      // Dictionary mit dem Validierunginformationen
      const validatorDict: {
        [name: string]: [     // key: Propertyname
          any,                // Propertywert
          ValidatorFn[]       // Array von Validatoren
        ]
      } = {};


      //
      // über alle column group infos
      //
      groupInfos.forEach((groupInfo) => {


        //
        // über alle column infos
        //
        groupInfo.columnInfos.forEach((info) => {
          const validators: ValidatorFn[] = [];
          const messageDict: IMessageDict = {};

          if (tableMetadata) {
            const colMetadata = tableMetadata.getColumnMetadataByProperty(info.valueField);

            if (colMetadata.validator instanceof CompoundValidator) {
              const vs = (colMetadata.validator as CompoundValidator).validators;

              vs.forEach((v) => {

                //
                // angular kompatible ValidatorFn erzeugen, die mit fluxgate Validation arbeitet
                //
                const validatorFn = (metadata: ColumnMetadata, vd: IValidation) =>
                  (control: AbstractControl): ValidationErrors | null => {
                    return using(new XLog(CoreComponent.logger, levels.DEBUG, 'validatorFn',
                      `validator = ${vd.constructor.name}, propertyName = ${metadata.propertyName}, ` +
                      `value = ${control.value}`), (lg) => {

                        const result = vd.validate(control.value, metadata);
                        if (result.ok) {
                          if (lg.isDebugEnabled()) {
                            lg.debug(`result ok`);
                          }
                          return null;
                        }

                        if (lg.isDebugEnabled()) {
                          lg.debug(`errors: ${Core.stringify(result.messages)}`);
                        }
                        return {
                          [metadata.propertyName]: result.messages
                        };
                      });
                  };


                validators.push(validatorFn(colMetadata, v));
              });
            }
          } else {

            if (info.required) {
              validators.push(Validators.required);
              // tslint:disable-next-line:no-string-literal
              messageDict['required'] = 'Value required';
            }

            if (info.dataType === DataTypes.NUMBER) {
              validators.push(Validators.pattern('[0-9]+'));
              // tslint:disable-next-line:no-string-literal
              messageDict['pattern'] = 'Only digits allowed';
            }
          }



          if (validators.length <= 0) {
            validators.push(Validators.nullValidator);    // noop Validator als einzigen Validator hinzufügen
          }
          validatorDict[info.valueField] = [
            dataItem[info.valueField],
            validators
          ];

          formInfo.setValidationMessages(info.valueField, messageDict);
        });

        if (log.isDebugEnabled()) {
          log.debug('validatorDict: ', Core.stringify(validatorDict));
        }
      });

      formInfo.setFormGroup(formBuilder.group(validatorDict));
    });
  }



  /**
   * Erzeugt mit Hilfe eines @see{FormBuilder}s für @param{dataItem} und die Infos @param{columnInfos} eine FormGroup
   * und registriert sich auf Formänderungen; über @param{tableMetadata} werden Validierungsinfos aus dem Model besorgt
   *
   * @param formBuilder der zugehörige FormBuilder
   * @param validatorDict Validierungsinformation
   * @param groupName  der Name der FormGroup
   */
  protected buildFormFromValidators(formBuilder: FormBuilder, validatorDict: IValidatorDict,
    groupName: string = FormGroupInfo.DEFAULT_NAME): void {
    Assert.notNull(formBuilder);
    Assert.notNull(validatorDict);
    Assert.notNullOrEmpty(groupName);

    using(new XLog(CoreComponent.logger, levels.INFO, 'buildForm', `groupName = ${groupName}`), (log) => {

      if (log.isDebugEnabled()) {
        log.debug('validatorDict: ', Core.stringify(validatorDict));
      }

      const formInfo = new FormGroupInfo();
      this.formInfos.set(groupName, formInfo);

      for (const key in validatorDict) {
        if (!Utility.isNullOrEmpty(key)) {
          formInfo.setValidationMessages(key, {});
        }
      }

      if (log.isDebugEnabled()) {
        log.debug('validatorDict: ', Core.stringify(validatorDict));
      }

      formInfo.setFormGroup(formBuilder.group(validatorDict));
    });
  }


  /**
   * Setzt den kpmpletten Form-Status mit allen FormGroups zurück (z.B. nach submit).
   */
  protected resetForm() {
    for (const info of this.formInfos.values) {
      info.reset();
    }
  }


  /**
   * Setzt den Form-Status für die entsprechende FormGroup zurück (z.B. nach submit).
   *
   * @param value - der Wert/die Werte, auf den die FormGroup gesetzt werden soll
   * @param groupName - der Name der FormGroup
   */
  protected resetFormGroup(value?: any, groupName: string = FormGroupInfo.DEFAULT_NAME) {
    Assert.notNullOrEmpty(groupName);
    const info = this.formInfos.get(groupName);
    info.reset(value);
  }


  /**
   * Liefert true, falls das Control @param{controlName} der Gruppe
   * @param{groupName} den Status invalid hat.
   *
   * @param controlName
   * @param groupName  der Name der FormGroup
   * @returns
   */
  protected isFormControlInvalid(controlName: string, groupName: string = FormGroupInfo.DEFAULT_NAME): boolean {
    Assert.notNullOrEmpty(groupName);
    Assert.notNullOrEmpty(controlName);

    const formInfo = this.formInfos.get(groupName);
    return formInfo.isFormControlInvalid(controlName);
  }


  /**
   * Fügt die @see{FormGroup} für den Namen @param{groupName} hinzu.
   *
   * @protected
   * @param formGroup neue FormGroup
   * @param [groupName=FormGroupInfo.DEFAULT_NAME]
   * @returns
   */
  protected addForm(formGroup: FormGroup, groupName: string = FormGroupInfo.DEFAULT_NAME) {
    Assert.notNull(formGroup);

    const formInfo = new FormGroupInfo(formGroup);
    this.formInfos.set(groupName, formInfo);
  }


  /**
   * Liefert den @see{MessageService}
   */
  protected get messageService(): MessageService {
    return this._messageService;
  }

  /**
   * Liefert den PrimeNG Service für Aktionsbestätigungen @see{ConfirmationService}
   */
  protected get confirmationService(): ConfirmationService {
    return this._confirmationService;
  }


  /**
   * Liefert ein Observable<IUser> für die Überwachung der Änderungen des aktuellen Users
   *
   * @returns
   */
  protected getCurrentUser(): Observable<IUser> {
    this.subscribeToStore(CurrentUserStore.ID);
    return this._currentUserService.getSubject().asObservable();
  }


  /**
   * Registriert den Store @param{storeId} für Statusänderungen.
   *
   * @param storeId
   * @returns
   */
  protected subscribeToStore<T, TId>(storeId: string): Subscription {
    const subscription = this.getStoreSubject(storeId).subscribe((command) => {
      this.onStoreUpdated(command);
    });
    this.saveSubscription(subscription);
    return subscription;
  }


  protected saveSubscription(subscription: Subscription) {
    this.subscriptions.push(subscription);
  }


  /**
   * "virtuelle" Methode; muss in konkreten Klassen überschrieben werden, um die entsprechenden Statusupdates
   * mitzubekommen. Dieser Handler wird nur einmal pro CommandStore registriert!
   *
   * @param command
   */
  protected onStoreUpdatedGlobal<T>(command: ServiceCommand<T>): void {
    Assert.notNull(command);

    using(new XLog(CoreComponent.logger, levels.INFO, 'onStoreUpdatedGlobal',
      `class: ${this.constructor.name}`), (log) => {
        log.log(`command = ${command.constructor.name}: ${command.toString()}`);

        const state = this.getStoreState(command.storeId);
        if (state.error) {
          // Exceptions werden bereits in Exception gelogged
          // log.error(`${state.error}`);
        }

        if (command.storeId === CurrentUserStore.ID && command instanceof CurrentItemSetCommand) {
          const userState = state as ICurrentItemServiceState<IUser>;

          // beim Logoff wird
          // - der Store zurückgesetzt, damit wir nicht beim nächsten Userlogin
          //   falsche oder eigentlich nicht verfügbare (Security) Daten übernehmen
          // - der EntityVersionCache zurückgesetzt
          if (!Types.isPresent(userState.currentItem)) {
            this.resetStore();

            EntityVersionCache.instance.reset();
          }
        }
      });
  }


  /**
   * "virtuelle" Methode; muss in konkreten Klassen überschrieben werden, um die entsprechenden Statusupdates
   * mitzubekommen. Dieser Handler wird für jede Componenten-Instanz registriert!
   *
   * @param value
   */
  protected onStoreUpdated<T extends IEntity<TId>, TId>(command: ServiceCommand<T>): void {
    Assert.notNull(command);
  }


  /**
   * Liefert den Store-Status für die Id @param{storeId};
   *
   * @param storeId
   * @returns
   */
  protected getStoreState<TState extends IServiceState>(storeId: string): TState {
    return this.store.getState(storeId) as TState;
  }


  /**
   * Setzt den Store und damit alle CommandStores auf den Intitialzustand zurück
   * (z.B. nach Änderung des aktuellen Users)
   */
  protected resetStore() {
    return this.store.reset();
  }


  /**
   * Liefert den aktuell angemeldeten User über den @CurrentUserStore
   *
   * @returns
   */
  protected get currentStoreUser(): IUser {
    const state = this.getStoreState<ICurrentItemServiceState<IUser>>(CurrentUserStore.ID);
    return state.currentItem;
  }


  protected getStoreSubject(storeId: string): CustomSubject<any> {
    return this.store.subject(storeId);
  }


  protected static hasStoreSubscription(storeId: string): boolean {
    return CoreComponent.storeSubscriptions.has(storeId);
  }

  protected static addStoreSubscription(storeId: string) {
    CoreComponent.storeSubscriptions.add(storeId);
  }

}