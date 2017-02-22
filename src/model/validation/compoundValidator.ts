import { IValidation, ValidationMessage, ValidationResult } from '.';
import { Validator } from './validator';


export class CompoundValidator extends Validator {

  constructor(private validators: IValidation[]) {
    super();
  }

  public validate(value: any): ValidationResult {
    const messages = new Array<ValidationMessage>();

    for (const validator of this.validators) {
      const result = validator.validate(value);
      if (!result.ok) {
        result.messages.map((message) => messages.push(message));
      }
    }

    return ValidationResult.create(messages.length <= 0, messages);
  }
}