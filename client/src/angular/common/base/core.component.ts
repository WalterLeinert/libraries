import { EventEmitter, Injector, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ValidatorFn, Validators } from '@angular/forms';

import 'rxjs/add/observable/from';
import { Observable } from 'rxjs/Observable';
import { Subscription } from 'rxjs/Subscription';


// -------------------------------------- logging --------------------------------------------
// tslint:disable-next-line:no-unused-variable
import { getLogger, ILogger, levels, using, XLog } from '@fluxgate/platform';
// -------------------------------------- logging --------------------------------------------

// Fluxgate
import {
  Assert, CustomSubject, Dictionary, Funktion, IMessage,
  MessageSeverity, ServerBusinessException, UniqueIdentifiable, Utility
} from '@fluxgate/core';

import {
  CompoundValidator, IEntity, IServiceState, IUser,
  PatternValidator, RangeValidator, RequiredValidator,
  ServiceCommand, SetCurrentItemCommand, Store, TableMetadata, UserStore
} from '@fluxgate/common';


import { IControlDisplayInfo } from '../../../base/displayConfiguration/controlDisplayInfo.interface';
import { DataTypes } from '../../../base/displayConfiguration/dataType';
import { MetadataDisplayInfoConfiguration } from '../../../base/displayConfiguration/metadataDisplayInfoConfiguration';
import { AppStore } from '../../redux/app-store';
import { AppInjector } from '../../services/appInjector.service';
import { MessageService } from '../../services/message.service';
import { MetadataService } from '../../services/metadata.service';
import { FormGroupInfo, IMessageDict } from './formGroupInfo';


export interface IValidatorDict {
  [name: string]: [     // key: Propertyname
    any,                // Propertywert
    ValidatorFn[] | ValidatorFn     // Array von Validatoren
  ];
}


/**
 * Basisklasse (Komponente) ohne Router, Service für alle GUI-Komponenten
 *
 * @export
 * @class CoreComponent
 * @implements {OnInit, OnDestroy}
 */
export abstract class CoreComponent extends UniqueIdentifiable implements OnInit, OnDestroy {
  protected static readonly logger = getLogger(CoreComponent);

  private static subscriptionMap: Dictionary<UniqueIdentifiable, Subscription[]> =
  new Dictionary<UniqueIdentifiable, Subscription[]>();

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

  protected currentUserChanged: EventEmitter<IUser> = new EventEmitter();

  protected constructor(private _messageService: MessageService) {
    super();

    this.store = AppInjector.instance.getInstance<Store>(AppStore);

    this.subscribeToStore(UserStore.ID);
    this.updateUserState();
  }


  /**
   * Init-Methode der Komponente: kann in konkreter Komponente überschrieben werden
   *
   * @memberOf BaseComponent
   */
  public ngOnInit() {
    using(new XLog(CoreComponent.logger, levels.INFO, 'ngOnInit', `class: ${this.constructor.name}`), (log) => {
      // ok
    });
  }


  /**
   * Destroy-Methode der Komponente: kann in konkreter Komponente überschrieben werden
   *
   * @memberOf BaseComponent
   */
  public ngOnDestroy() {
    using(new XLog(CoreComponent.logger, levels.INFO, 'ngOnDestroy', `class: ${this.constructor.name}`), (log) => {

      log.log(`unsubscribe store ${this.subscriptions.length} subscriptions`);
      Observable.from(this.subscriptions).subscribe((sub) => {
        sub.unsubscribe();
      });

      if (CoreComponent.subscriptionMap.containsKey(this)) {
        if (log.isDebugEnabled()) {
          log.debug(`components registered with subscriptions: ${CoreComponent.subscriptionMap.count}`);
          CoreComponent.subscriptionMap.keys.forEach((key) => {
            const subscriptions = CoreComponent.subscriptionMap.get(key);
            log.debug(`  key = ${key.constructor.name}: ${subscriptions.length} subscriptions`);
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
   * @returns {boolean}
   *
   * @memberOf CoreComponent
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



  /**
   * löscht alle Messages
   *
   * @protected
   *
   * @memberOf BaseComponent
   */
  protected clearMessages() {
    this._messageService.clearMessage();
  }

  /**
   * fügt eine neue Info-Meldungung hinzu
   *
   * @protected
   * @param {string} text
   * @param {string} [summary='Hinweis']
   *
   * @memberOf BaseComponent
   */
  protected addSuccessMessage(text: string, summary = CoreComponent.SUCCESS_TEXT) {
    this.addMessage({ severity: MessageSeverity.Success, summary: summary, detail: text });
  }


  /**
   * fügt eine neue Info-Meldungung hinzu
   *
   * @protected
   * @param {string} text
   * @param {string} [summary='Hinweis']
   *
   * @memberOf BaseComponent
   */
  protected addInfoMessage(text: string, summary = CoreComponent.INFO_TEXT) {
    this.addMessage({ severity: MessageSeverity.Info, summary: summary, detail: text });
  }

  /**
   * fügt eine neue Warn-Meldungung hinzu
   *
   * @protected
   * @param {string} text
   * @param {string} [summary='Hinweis']
   *
   * @memberOf BaseComponent
   */
  protected addWarnMessage(text: string, summary = CoreComponent.WARN_TEXT) {
    this.addMessage({ severity: MessageSeverity.Warn, summary: summary, detail: text });
  }


  /**
   * fügt eine neue Fehlermeldungung hinzu
   *
   * @protected
   * @param {string} text
   * @param {string} [summary='Fehlermeldung']
   *
   * @memberOf BaseComponent
   */
  protected addErrorMessage(text: string, summary = CoreComponent.ERROR_TEXT) {
    this.addMessage({ severity: MessageSeverity.Error, summary: summary, detail: text });
  }

  /**
   * fügt eine neue Meldung hinzu
   *
   * @protected
   * @param {Message} message
   *
   * @memberOf BaseComponent
   */
  protected addMessage(message: IMessage) {
    this.messageService.addMessage(message);
  }

  /**
   * Behandelt eine Fehlermeldung
   *
   * @protected
   * @param {Error} error
   * @param {string} [summary='Fehlermeldung']
   *
   * @memberOf BaseComponent
   */
  protected handleError(error: Error, summary?: string) {
    if (error instanceof ServerBusinessException) {
      this.addInfoMessage(error.message, summary);
    } else {
      this.addErrorMessage(error.message, summary);
    }
  }


  /**
   * Die rxjs Subscription @param{subscription} für spätere Freigabe registrieren.
   *
   * @protected
   * @param {Subscription} subscription
   *
   * @memberOf CoreComponent
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


  protected createDisplayInfos(item: any, model: Funktion, metadataService: MetadataService, injector: Injector):
    IControlDisplayInfo[] {
    Assert.notNull(item);
    Assert.notNull(model);
    Assert.notNull(metadataService);
    Assert.notNull(injector);

    const tableMetadata = metadataService.findTableMetadata(model);
    const configurator = new MetadataDisplayInfoConfiguration(tableMetadata, metadataService, injector);
    return configurator.createConfig(item);
  }


  /**
   * Erzeugt mit Hilfe eines @see{FormBuilder}s für die Modelklasse @param{clazz} über die Metadaten
   * und den Injector eine FormGroup @param{groupName} und liefert eine neu erzeugte Modelinstanz.
   *
   * @protected
   * @template T
   * @param {FormBuilder} formBuilder
   * @param {Funktion} model
   * @param {MetadataService} metadataService
   * @param {Injector} injector
   * @param {string} [groupName=FormGroupInfo.DEFAULT_NAME]
   * @returns {T}
   *
   * @memberOf CoreComponent
   */
  protected buildFormFromModel<T>(formBuilder: FormBuilder, clazz: Funktion, metadataService: MetadataService,
    injector: Injector, groupName: string = FormGroupInfo.DEFAULT_NAME): T {
    const tableMetadata = metadataService.findTableMetadata(clazz);
    Assert.notNull(tableMetadata, `Metadaten für Tabelle ${clazz.name}`);

    const obj = tableMetadata.createEntity<T>();
    const displayInfos = this.createDisplayInfos(obj, clazz, metadataService, injector);
    this.buildForm(formBuilder, obj, displayInfos, tableMetadata, groupName);

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
  protected buildForm(formBuilder: FormBuilder, dataItem: any, displayInfos: IControlDisplayInfo[],
    tableMetadata: TableMetadata, groupName: string = FormGroupInfo.DEFAULT_NAME): void {
    Assert.notNullOrEmpty(groupName);
    Assert.notNull(formBuilder);
    Assert.notNull(dataItem);
    Assert.notNullOrEmpty(displayInfos);

    using(new XLog(CoreComponent.logger, levels.INFO, 'buildForm', `groupName = ${groupName}`), (log) => {

      // Dictionary mit dem Validierunginformationen
      const validatorDict: {
        [name: string]: [     // key: Propertyname
          any,                // Propertywert
          ValidatorFn[]       // Array von Validatoren
        ]
      } = {};

      const formInfo = new FormGroupInfo();
      this.formInfos.set(groupName, formInfo);


      displayInfos.forEach((info) => {
        const validators: ValidatorFn[] = [];
        const messageDict: IMessageDict = {};

        if (tableMetadata) {
          const colMetadata = tableMetadata.getColumnMetadataByProperty(info.valueField);
          if (colMetadata.validator instanceof CompoundValidator) {
            const vs = (colMetadata.validator as CompoundValidator).validators;
            vs.forEach((v) => {
              if (v instanceof PatternValidator) {
                validators.push(Validators.pattern(v.pattern));
                // tslint:disable-next-line:no-string-literal
                messageDict['pattern'] = Utility.isNullOrEmpty(v.info) ? `Pattern ${v.pattern} not matched` : v.info;
              } else if (v instanceof RequiredValidator) {
                validators.push(Validators.required);
                // tslint:disable-next-line:no-string-literal
                messageDict['required'] = 'Value required';
              } else if (v instanceof RangeValidator) {
                if (v.options.min !== undefined) {
                  validators.push(Validators.minLength(v.options.min));
                  // tslint:disable-next-line:no-string-literal
                  messageDict['minlength'] = `Minimum length of ${v.options.min} characters required`;
                }
                if (v.options.max !== undefined) {
                  validators.push(Validators.maxLength(v.options.max));
                  // tslint:disable-next-line:no-string-literal
                  messageDict['maxlength'] = `Maximum length of ${v.options.max} characters required`;
                }
              }
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
        log.debug('validatorDict: ', JSON.stringify(validatorDict));
      }

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
        log.debug('validatorDict: ', JSON.stringify(validatorDict));
      }

      const formInfo = new FormGroupInfo();
      this.formInfos.set(groupName, formInfo);

      for (const key in validatorDict) {
        if (!Utility.isNullOrEmpty(key)) {
          formInfo.setValidationMessages(key, {});
        }
      }

      if (log.isDebugEnabled()) {
        log.debug('validatorDict: ', JSON.stringify(validatorDict));
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
   * @param {string} controlName
   * @param groupName  der Name der FormGroup
   * @returns {boolean}
   */
  protected isFormControlInvalid(controlName: string, groupName: string = FormGroupInfo.DEFAULT_NAME): boolean {
    Assert.notNullOrEmpty(groupName);
    Assert.notNullOrEmpty(controlName);

    const formInfo = this.formInfos.get(groupName);
    return formInfo.isFormControlInvalid(controlName);
  }


  /**
   * Liefert die zugehörige @see{FormGroup} für den Namen @param{groupName}.
   *
   * @protected
   * @param {string} [groupName=FormGroupInfo.DEFAULT_NAME]
   * @returns {FormGroup}
   *
   * @memberOf CoreComponent
   */
  protected getForm(groupName: string = FormGroupInfo.DEFAULT_NAME): FormGroup {
    Assert.notNullOrEmpty(groupName);
    const formInfo = this.formInfos.get(groupName);
    if (formInfo) {
      return formInfo.form;
    }
    return null;
  }


  /**
   * Liefert die default FormGroup
   *
   * @readonly
   * @protected
   * @type {FormGroup}
   * @memberOf CoreComponent
   */
  protected get form(): FormGroup {
    return this.getForm();
  }

  /**
   * Liefert die Validierungsfehler für das angegebene Control @param{controlName} und die
   * FormGroup @param{groupName}
   *
   * @protected
   * @param {string} controlName
   * @param {string} [groupName=FormGroupInfo.DEFAULT_NAME]
   * @returns {string}
   *
   * @memberOf CoreComponent
   */
  protected getFormErrors(controlName: string, groupName: string = FormGroupInfo.DEFAULT_NAME): string {
    Assert.notNullOrEmpty(controlName);
    Assert.notNullOrEmpty(groupName);
    const formInfo = this.formInfos.get(groupName);
    return formInfo.getFormErrors(controlName);
  }


  /**
   * Liefert den @see{MessageService}
   */
  protected get messageService(): MessageService {
    return this._messageService;
  }


  /**
   * Registriert den Store @param{storeId} für Statusänderungen.
   *
   * @protected
   * @template T
   * @template TId
   * @param {string} storeId
   * @returns {Subscription}
   *
   * @memberOf CoreComponent
   */
  protected subscribeToStore<T, TId>(storeId: string): Subscription {
    const subscription = this.getStoreSubject(storeId).subscribe((command) => {
      this.onStoreUpdated(command);
    });
    this.subscriptions.push(subscription);
    return subscription;
  }


  /**
   * "virtuelle" Methode; muss in konkreten Klassen überschrieben werden, um die entsprechenden Statusupdates
   * mitzubekommen.
   *
   * @protected
   * @template T
   * @template TId
   * @param {ServiceCommand<T, TId>} value
   *
   * @memberOf CoreComponent
   */
  protected onStoreUpdated<T extends IEntity<TId>, TId>(command: ServiceCommand<T, TId>): void {
    Assert.notNull(command);

    using(new XLog(CoreComponent.logger, levels.INFO, 'onStoreUpdated', `class: ${this.constructor.name}`), (log) => {
      log.log(`command = ${command.constructor.name}: ${JSON.stringify(command)}`);

      const state = this.getStoreState(command.storeId);
      if (state.error) {
        log.error(`${state.error}`);
      }

      if (command.storeId === UserStore.ID && command instanceof SetCurrentItemCommand) {
        this.updateUserState(command);
      }
    });
  }



  /**
   * Liefert den Store-Status für die Id @param{storeId};
   *
   * @protected
   * @template T
   * @template TId
   * @param {string} storeId
   * @returns {IServiceState<T, TId>}
   *
   * @memberOf CoreComponent
   */
  protected getStoreState<T extends IEntity<TId>, TId>(storeId: string): IServiceState<T, TId> {
    return this.store.getState<IServiceState<T, TId>>(storeId);
  }


  /**
   * Liefert den aktuell angemeldeten User.
   *
   * @protected
   * @returns {IUser}
   *
   * @memberOf CoreComponent
   */
  protected getCurrentUser(): IUser {
    const state = this.getStoreState<IUser, number>(UserStore.ID);
    return state.currentItem;
  }


  /**
   * Feuert den currentUserChanged-Event, immer wenn sich der aktuelle/angemeldete User ändert.
   *
   * @private
   *
   * @memberOf CoreComponent
   */
  private updateUserState(command?: ServiceCommand<IUser, number>) {
    if (command instanceof SetCurrentItemCommand) {
      this.currentUserChanged.emit(this.getCurrentUser());
    }
  }


  private getStoreSubject(storeId: string): CustomSubject<any> {
    return this.store.subject(storeId);
  }

}