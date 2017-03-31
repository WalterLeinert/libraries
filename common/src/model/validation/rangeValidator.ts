import { StringBuilder } from '../../base';
import { Assert } from '../../util/assert';

import { ValidationResult } from './validationResult';
import { Validator } from './validator';

export interface IRangeOptions {
  min?: number;
  max?: number;
}

export class RangeValidator extends Validator {

  constructor(private _options: IRangeOptions) {
    super();
    Assert.notNull(_options);
    Assert.that(_options.min !== undefined || _options.max !== undefined);
  }

  public validate(value: string, propertyName?: string): ValidationResult {
    if (this._options.min !== undefined) {
      let error = true;
      const sb = new StringBuilder(this.formatPropertyName(propertyName));
      sb.append(`Text`);

      if (value === undefined) {
        sb.append(' is missing and');
      } else if (value.length < this._options.min) {
        sb.append(` '${value}'`);
      } else {
        error = false;
      }
      if (error) {
        sb.append(` must contain at least ${this._options.min} characters.`);
        return ValidationResult.create(false, sb.toString());
      }
    }

    if (this._options.max !== undefined) {
      let error = true;
      const sb = new StringBuilder(this.formatPropertyName(propertyName));
      sb.append(`Text`);

      if (value === undefined) {
        sb.append(' ist missing and');
      } else if (value.length > this._options.max) {
        sb.append(` '${value}'`);
      } else {
        error = false;
      }
      if (error) {
        sb.append(` may contain not more than ${this._options.max} characters.`);
        return ValidationResult.create(false, sb.toString());
      }
    }

    return ValidationResult.Ok;
  }

  public get options(): IRangeOptions {
    return this._options;
  }
}