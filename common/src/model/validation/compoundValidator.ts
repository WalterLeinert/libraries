import { ColumnMetadata } from '../metadata/columnMetadata';
import { IValidation } from './validation.interface';
import { ValidationMessage } from './validationMessage';
import { ValidationResult } from './validationResult';
import { Validator } from './validator';


export class CompoundValidator extends Validator {

  constructor(private _validators: IValidation[], info?: string) {
    super(info);
  }

  public validate(value: any, property?: string | ColumnMetadata): ValidationResult {
    const messages = new Array<ValidationMessage>();

    for (const validator of this._validators) {
      const result = validator.validate(value, property);
      if (!result.ok) {
        result.messages.map((message) => messages.push(message));
      }
    }

    return ValidationResult.create(this, property, messages.length <= 0, messages);
  }

  public get validators(): IValidation[] {
    return this._validators;
  }
}