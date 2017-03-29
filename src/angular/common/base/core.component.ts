import { Injector, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ValidatorFn, Validators } from '@angular/forms';

import { Subscription } from 'rxjs/Subscription';


// -------------------------------------- logging --------------------------------------------
// tslint:disable-next-line:no-unused-variable
import { getLogger, ILogger, levels, using, XLog } from '@fluxgate/common';
// -------------------------------------- logging --------------------------------------------

// Fluxgate
import {
  Assert, CompoundValidator, Dictionary, Funktion, IMessage, InvalidOperationException,
  MessageSeverity, PatternValidator, RangeValidator,
  RequiredValidator, TableMetadata, Types, UniqueIdentifiable, Utility
} from '@fluxgate/common';

import { ControlType } from '../../../angular/modules/common/controlType';
import { IControlDisplayInfo } from '../../../base/displayConfiguration/controlDisplayInfo.interface';
import { DataTypes } from '../../../base/displayConfiguration/dataType';
import { MetadataDisplayInfoConfiguration } from '../../../base/displayConfiguration/metadataDisplayInfoConfiguration';
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
// tslint:disable-next-line:max-classes-per-file
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

  protected constructor(private _messageService: MessageService) {
    super();
  }


  /**
   * Init-Methode der Komponente: kann in konkreter Komponente überschrieben werden
   * 
   * @memberOf BaseComponent
   */
  public ngOnInit() {
    using(new XLog(CoreComponent.logger, levels.INFO, 'ngOnInit', `name = ${this.constructor.name}`), (log) => {
      // ok
    });
  }


  /**
   * Destroy-Methode der Komponente: kann in konkreter Komponente überschrieben werden
   * 
   * @memberOf BaseComponent
   */
  public ngOnDestroy() {
    using(new XLog(CoreComponent.logger, levels.INFO, 'ngOnDestroy', `name = ${this.constructor.name}`), (log) => {

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
    this.addErrorMessage(error.message, summary);
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
   * Erzeugt mit Hilfe eines @see{FormBuilder}s für @param{dataItem} und die Infos @param{columnInfos} eine FormGroup
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


        // TODO: workaround: entfernen, sobald die Controls den Angular-Control Contract implementieren
        if (!(info.controlType === ControlType.Time || info.controlType === ControlType.DropdownSelector)) {

          if (validators.length <= 0) {
            validators.push(Validators.nullValidator);    // noop Validator als einzigen Validator hinzufügen
          }
          validatorDict[info.valueField] = [
            dataItem[info.valueField],
            validators
          ];

          formInfo.setValidationMessages(info.valueField, messageDict);
        }
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
          const v = validatorDict[key];

          // v[0].validators.foreach((item) => {
          // formInfo.setValidationMessages(info.valueField, messageDict);
          // formInfo.setErrors(info.valueField, '');
          // });
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
    return formInfo.form;
  }

  protected getFormErrors(controlName: string, groupName: string = FormGroupInfo.DEFAULT_NAME): string {
    Assert.notNullOrEmpty(controlName);
    Assert.notNullOrEmpty(groupName);
    const formInfo = this.formInfos.get(groupName);
    return formInfo.getFormErrors(controlName);;
  }


  /**
   * Liefert den @see{MessageService}
   */
  protected get messageService(): MessageService {
    return this._messageService;
  }
}