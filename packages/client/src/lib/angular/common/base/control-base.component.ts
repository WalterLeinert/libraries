import { EventEmitter, Output } from '@angular/core';
import { AbstractControl, ControlValueAccessor, NgModel, Validator } from '@angular/forms';

// -------------------------------------- logging --------------------------------------------
// tslint:disable-next-line:no-unused-variable
import { getLogger, ILogger, levels, using, XLog } from '@fluxgate/platform';
// -------------------------------------- logging --------------------------------------------

import { Core } from '@fluxgate/core';

import { CoreComponent } from './core.component';


/**
 * Basisklasse für eigene Controls, die Databinding auf Forms über ngModel und Validierung
 * unterstützen
 */
export abstract class ControlBaseComponent<T> extends CoreComponent implements ControlValueAccessor, Validator {
  protected static readonly logger = getLogger(ControlBaseComponent);

  private _value: T;

  @Output() public valueChange: EventEmitter<T> = new EventEmitter<T>();

  protected abstract model: NgModel;

  protected parseError: boolean;



  // >>> interface Validator >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
  /**
   * Validiert das Control
   *
   * Muss in konkreten Klassen überschrieben werden!
   *
   * @abstract
   * @param control
   * @returns null (falls ok), sonst ein Validation Object (dictionary)
   *
   * @memberOf SelectorBaseComponent
   */
  // public validate(control: AbstractControl): { [key: string]: any } {
  //   throw new NotSupportedException(`control = ${control}`);
  // }

  public validate(control: AbstractControl): { [key: string]: any } {
    return using(new XLog(ControlBaseComponent.logger, levels.INFO, 'vaidate'), (log) => {
      log.error(`${this.constructor.name}: validate muss überschrieben werden.`);

      return (!this.parseError) ? null : {
        error: {
          valid: false
        },
      };
    });
  }
  // <<< interface Validator >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>

  // >>> interface ControlValueAccessor ---------------------------------
  public get value(): T {
    return this._value;
  }

  public set value(value: T) {
    using(new XLog(ControlBaseComponent.logger, levels.DEBUG, 'set value'), (log) => {
      if (log.isDebugEnabled()) {
        log.log(`class: ${this.constructor.name}: old value = ${Core.stringify(this._value)},` +
          ` value = ${Core.stringify(value)}`);
      }

      if (this._value !== value) {
        this._value = value;
        this.onChangeCallback(value);    // -> angular
        this.onValueChange(value);    // -> fluxgate
      }
    });
  }


  /**
   * Write a new value to the element.
   */
  public writeValue(value: T) {
    using(new XLog(ControlBaseComponent.logger, levels.DEBUG, 'writeValue'), (log) => {
      if (log.isDebugEnabled()) {
        log.log(`class: ${this.constructor.name}: value = ${Core.stringify(value)}`);
      }

      if (this._value !== value) {
        this._value = value;

        this.onValueChange(value);    // -> fluxgate
        this.onValueWritten(value);
      }
    });
  }


  /**
   * Set the function to be called when the control receives a change event.
   */
  public registerOnChange(fn: any) {
    this.onChangeCallback = fn;
  }


  /**
   * Set the function to be called when the control receives a touch event.
   */
  public registerOnTouched(fn: any) {
    this.onTouchedCallback = fn;
  }



  /**
   * This function is called when the control status changes to or from "DISABLED".
   * Depending on the value, it will enable or disable the appropriate DOM element.
   *
   * @param isDisabled
   */
  public setDisabledState(isDisabled: boolean): void {
    this.onDisabledChanged(isDisabled);
  }

  // <<< interface ControlValueAccessor ---------------------------------

  /**
   * ValueChange-Handler: in konrekten Klassen überschreiben
   *
   * @protected
   * @param value
   */
  protected onValueChange(value: T) {
    using(new XLog(ControlBaseComponent.logger, levels.DEBUG, 'onValueChange'), (log) => {
      if (log.isDebugEnabled()) {
        log.log(`class: ${this.constructor.name}: value = ${Core.stringify(value)}`);
      }
      this.valueChange.emit(value);
    });
  }


  protected onDisabledChanged(disabled: boolean) {
    // ok
  }

  protected onTouched() {
    this.onTouchedCallback();
  }


  /**
   * ggf. in konrekten Klassen überschreiben, um nach @see{ControlValueAccessor.writeValue} noch Aktionen auszuführen.
   * @param value *
   */
  protected onValueWritten(value: T) {
    // ok
  }

  private onChangeCallback = (_: any) => {
    // ok
  }

  private onTouchedCallback = () => {
    // ok
  }
}