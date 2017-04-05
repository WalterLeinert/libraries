import { AbstractControl, ControlValueAccessor, NgModel, Validator } from '@angular/forms';

import { NotSupportedException } from '@fluxgate/common';

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
  private _value: T;

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
  public validate(control: AbstractControl): { [key: string]: any } {
    throw new NotSupportedException(`control = ${control}`);
  }
  // <<< interface Validator >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>

  // >>> interface ControlValueAccessor ---------------------------------
  public get value(): T {
    return this._value;
  }

  public set value(value: T) {
    if (this._value !== value) {
      this._value = value;
      this.onValueChange(value);
    }
  }

  public writeValue(value: T) {
    this._value = value;
  }

  public registerOnChange(fn: (value: T) => void) {
    this.onValueChange = fn;
  }

  public registerOnTouched(fn: () => void) {
    this.onTouched = fn;
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
    // ok
  }

  protected onTouched() {
    // ok
  }
}