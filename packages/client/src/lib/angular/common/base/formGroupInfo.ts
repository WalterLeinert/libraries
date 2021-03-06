import { FormGroup } from '@angular/forms';

// Fluxgate
import { Clone } from '@fluxgate/core';


export interface IMessageDict {
  [key: string]: string;
}


/**
 * Hilfsklasse für die Behandlung mehrerer FormGroups auf einer Form (v.a. für Valdierung)
 */
export class FormGroupInfo {
  /**
   * der Default FormGroup-Name
   */
  public static readonly DEFAULT_NAME = 'form';

  private _form: FormGroup;
  private errors: IMessageDict = {};
  private validationMessages: { [key: string]: IMessageDict } = {};

  public constructor(form?: FormGroup) {
    if (form) {
      this.setFormGroup(form);
    }
  }

  public setFormGroup(formGroup: FormGroup) {
    this._form = formGroup;
    this._form.valueChanges.subscribe((data) => this.onValueChanged(data));
    this.onValueChanged();
  }

  public hasChanges(): boolean {
    return this._form && this._form.dirty;
  }

  public isValid(): boolean {
    return this._form && this._form.valid;
  }

  public reset(value?: any) {
    this._form.reset(value);
  }

  public static getClonedValue(value: any): any {
    let valueCloned;

    if (value !== undefined) {
      valueCloned = Clone.clone(value);
    }
    return valueCloned;
  }

  public setValidationMessages(valueField: string, messages: IMessageDict) {
    this.validationMessages[valueField] = messages;
    this.errors[valueField] = '';
  }

  public updateFormErrors() {
    if (!this._form) {
      return;
    }
    for (const field in this.errors) {
      if (field) {
        // clear previous error message (if any)
        this.errors[field] = '';
        const control = this._form.get(field);

        if (control && control.dirty && !control.valid) {
          for (const valMsg of control.errors[field]) {
            if (valMsg) {
              this.errors[field] += valMsg.text;
            }
          }
        }
      }
    }
  }


  /**
   * Liefert true, falls das Control @param{controlName} den Status invalid hat.
   *
   * @param controlName
   * @returns
   */
  public isFormControlInvalid(controlName: string): boolean {
    return this._form.controls[controlName].invalid;
  }

  public get form(): FormGroup {
    return this._form;
  }

  public getFormErrors(controlName: string): string {
    return this.errors[controlName];
  }


  private onValueChanged(dataa?: any) {
    this.updateFormErrors();
  }
}