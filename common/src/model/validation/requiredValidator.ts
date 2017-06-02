import { StringBuilder, Types } from '@fluxgate/core';

import { ValidationResult } from './validationResult';
import { Validator } from './validator';


export class RequiredValidator extends Validator {

  constructor() {
    super();
  }

  public validate(value: any, propertyName?: string): ValidationResult {
    const sb = new StringBuilder(this.formatPropertyName(propertyName));

    if (!Types.isPresent(value)) {
      sb.append(`Value is required.`);
      return ValidationResult.create(false, sb.toString());
    }
    if (Types.isString(value)) {
      if (value.length <= 0) {
        sb.append(`Text is missing.`);
        return ValidationResult.create(false, sb.toString());
      }
    }

    return ValidationResult.Ok;
  }
}