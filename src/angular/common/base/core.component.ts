import { OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import { Subscription } from 'rxjs/Subscription';


// -------------------------------------- logging --------------------------------------------
// tslint:disable-next-line:no-unused-variable
import { getLogger, ILogger, levels, using, XLog } from '@fluxgate/common';
// -------------------------------------- logging --------------------------------------------

// Fluxgate
import { Assert, Clone, Dictionary, IMessage, MessageSeverity, UniqueIdentifiable } from '@fluxgate/common';

import { ControlType } from '../../../angular/modules/common/controlType';
import { IControlDisplayInfo } from '../../../base';
import { DataType, DataTypes } from '../../../base/displayConfiguration/dataType';
import { MessageService } from '../../services/message.service';

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
  protected form: FormGroup;

  public formErrors: { [key: string]: any } = {
    date: ''    // nur Beispiel: die Errors werden über Validierung von angular erzeugt
  };

  private validationMessages: { [key: string]: any } = {
    date: {     // nur Beispiel: die Messages werden über die Konfiguraton/Metadaten aufgebaut
      required: 'Date is required.',
    }
  };
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
   * Setzt der Form-Status zurück (z.B. nach submit)
   * 
   * @param handler 
   * @param form 
   */
  public resetForm(value?: any, form?: FormGroup) {
    if (form) {
      const valueCloned = this.getClonedValue(value);
      form.reset(valueCloned);
    } else {
      if (this.form) {
        const valueCloned = this.getClonedValue(value);
        this.form.reset(valueCloned);
      }
    }
  }


  /**
   * Liefert true, falls eine zugehörige (Reactive) Form existiert und diese dirty ist.
   * Muss in konkreten Komponentenklassen überschrieben werden, falls zusätzliche Bedingungen greifen sollen.
   * 
   * @returns {boolean} 
   * 
   * @memberOf CoreComponent
   */
  public hasChanges(): boolean {
    return this.form && this.form.dirty;
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



  /**
   * Erzeugt mit Hilfe eines @see{FormBuilder}s für @param{dataItem} und die Infos @param{columnInfos} eine FormGroup
   * und registriert sich auf Formänderungen
   * 
   * @param formBuilder 
   * @param dataItem 
   * @param columnInfos 
   */
  protected buildForm(formBuilder: FormBuilder, dataItem: any, columnInfos: IControlDisplayInfo[]) {
    const dict: { [name: string]: any } = {};

    this.validationMessages = {};
    this.formErrors = {};

    columnInfos.forEach((info) => {

      // TODO: workaround: entfernen, sobald die Controls den Angular-Control Contract implementieren
      if (!(info.controlType === ControlType.Time || info.controlType === ControlType.DropdownSelector)) {
        const validators: any[] = [Validators.nullValidator];
        const messageDict = {};

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

        dict[info.valueField] = [dataItem[info.valueField], [
          Validators.compose(validators)
        ]
        ];


        // TODO: richtige Meldungen erzeugen
        this.validationMessages[info.valueField] = messageDict;
        this.formErrors[info.valueField] = '';
      }
    });

    this.form = formBuilder.group(dict);

    this.form.valueChanges.subscribe((data) => this.onValueChanged(data));
    this.onValueChanged();
  }


  private onValueChanged(data?: any) {
    if (!this.form) { return; }

    for (const field in this.formErrors) {
      if (field) {
        // clear previous error message (if any)
        this.formErrors[field] = '';
        const control = this.form.get(field);

        if (control && control.dirty && !control.valid) {
          const messages = this.validationMessages[field];
          for (const key in control.errors) {
            if (key) {
              this.formErrors[field] += messages[key] + ' ';
            }
          }
        }
      }
    }
  }


  /**
   * Liefert den @see{MessageService}
   */
  protected get messageService(): MessageService {
    return this._messageService;
  }


  private getClonedValue(value: any): any {
    let valueCloned;

    if (value !== undefined) {
      valueCloned = Clone.clone(value);
    }
    return valueCloned;
  }

}