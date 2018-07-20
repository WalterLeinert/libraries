import { Types } from '@fluxgate/core';

import { ColumnMetadata } from '../metadata/columnMetadata';
import { ValidationResult } from './validationResult';
import { Validator } from './validator';


export class RequiredValidator extends Validator {

  constructor(info?: string) {
    super(info);
  }

  public validate(value: any, property?: string | ColumnMetadata): ValidationResult {
    if (!Types.isPresent(value)) {
      return ValidationResult.create(this, property, false, `Value is required.`);
    }
    if (Types.isString(value)) {
      if (value.length <= 0) {
        return ValidationResult.create(this, property, false, `Value is required.`);
      }
    }

    return ValidationResult.OK;
  }
}