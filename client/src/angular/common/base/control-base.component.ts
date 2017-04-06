import { EventEmitter, Output } from '@angular/core';
import { AbstractControl, ControlValueAccessor, NgModel, Validator } from '@angular/forms';

// -------------------------------------- logging --------------------------------------------
// tslint:disable-next-line:no-unused-variable
import { getLogger, ILogger, levels, using, XLog } from '@fluxgate/common';
// -------------------------------------- logging --------------------------------------------


import { CoreComponent } from './core.component';


/**
 * Basisklasse für eigene Controls, die Databinding auf Forms über ngModel und Validierung
 * unterstützen
 *
 * @export
 * @class ControlBaseComponent
 * @extends {CoreComponent}
 * @implements {ControlValueAccessor}
 * @implements {Validator}
 * @template T
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
   * @param {FormControl} control
   * @returns {*} null (falls ok), sonst ein Validation Object (dictionary)
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
        log.log(`class: ${this.constructor.name}: old value = ${JSON.stringify(this._value)},` +
          ` value = ${JSON.stringify(value)}`);
      }

      if (this._value !== value) {
        this._value = value;
        this.onModelChange(value);    // -> angular
        this.onValueChange(value);    // -> fluxgate
      }
    });
  }

  public writeValue(value: T) {
    using(new XLog(ControlBaseComponent.logger, levels.DEBUG, 'writeValue'), (log) => {
      if (log.isDebugEnabled()) {
        log.log(`class: ${this.constructor.name}: value = ${JSON.stringify(value)}`);
      }
      this._value = value;

      this.onValueChange(value);    // -> fluxgate
      this.onValueWritten(value);
    });
  }

  public registerOnChange(fn: (value: T) => void) {
    this.onModelChange = fn;
  }

  public registerOnTouched(fn: () => void) {
    this.onModelTouched = fn;
  }
  // <<< interface ControlValueAccessor ---------------------------------

  /**
   * ValueChange-Handler: in konrekten Klassen überschreiben
   *
   * @protected
   * @param {T} value
   *
   * @memberOf ControlBaseComponent
   */
  protected onValueChange(value: T) {
    using(new XLog(ControlBaseComponent.logger, levels.DEBUG, 'onValueChange'), (log) => {
      if (log.isDebugEnabled()) {
        log.log(`class: ${this.constructor.name}: value = ${JSON.stringify(value)}`);
      }
      this.valueChange.emit(value);
    });
  }

  protected onTouched() {
    // ok
  }


  /**
   * ggf. in konrekten Klassen überschreiben, um nach @see{ControlValueAccessor.writeValue} noch Aktionen auszuführen.
   * @param value *
   */
  protected onValueWritten(value: T) {
    // ok
  }

  private onModelChange = (_: any) => {
    // ok
  }

  private onModelTouched = (_: any) => {
    // ok
  }
}