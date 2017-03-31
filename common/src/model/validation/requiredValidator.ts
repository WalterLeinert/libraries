import { StringBuilder } from '../../base';
import { ValidationResult } from './validationResult';
import { Validator } from './validator';


export class RequiredValidator extends Validator {

  constructor() {
    super();
  }

  public validate(value: any, propertyName?: string): ValidationResult {
    const sb = new StringBuilder(this.formatPropertyName(propertyName));

    if (value === undefined || value === null) {
      sb.append(`Value is required.`);
      return ValidationResult.create(false, sb.toString());
    }
    if (typeof value === 'string') {
      if (value.length <= 0) {
        sb.append(`Text is missing.`);
        return ValidationResult.create(false, sb.toString());
      }
    }

    return ValidationResult.Ok;
  }
}