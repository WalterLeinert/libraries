import { IValidation, ValidationMessage, ValidationResult } from '.';
import { Validator } from './validator';


export class CompoundValidator extends Validator {

  constructor(private _validators: IValidation[]) {
    super();
  }

  public validate(value: any, propertyName?: string): ValidationResult {
    const messages = new Array<ValidationMessage>();

    for (const validator of this._validators) {
      const result = validator.validate(value, propertyName);
      if (!result.ok) {
        result.messages.map((message) => messages.push(message));
      }
    }

    return ValidationResult.create(messages.length <= 0, messages);
  }

  public get validators(): IValidation[] {
    return this._validators;
  }
}