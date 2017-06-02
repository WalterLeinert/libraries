import { Assert, StringBuilder, Types } from '@fluxgate/core';

import { ColumnMetadata } from '../metadata/columnMetadata';
import { ValidationResult } from './validationResult';
import { Validator } from './validator';

export interface IRangeOptions {
  min?: number;
  max?: number;
}

export class RangeValidator extends Validator {

  constructor(private _options: IRangeOptions, info?: string) {
    super(info);
    Assert.notNull(_options);
    Assert.that(_options.min !== undefined || _options.max !== undefined);
  }

  public validate(value: any, property?: string | ColumnMetadata): ValidationResult {
    if (!Types.isPresent(value)) {
      return ValidationResult.Ok;
    }

    const sb = new StringBuilder(this.formatPropertyName(property));

    if (this._options.min !== undefined) {
      if (!RangeValidator.isLessThan(value, property, this._options.min, sb)) {
        return ValidationResult.create(this, property, false, sb.toString());
      }
    }

    if (this._options.max !== undefined) {
      if (!RangeValidator.isGreaterThan(value, property, this._options.max, sb)) {
        return ValidationResult.create(this, property, false, sb.toString());
      }
    }

    return ValidationResult.Ok;
  }


  public get options(): IRangeOptions {
    return this._options;
  }


  private static isLessThan(value: any, property: string | ColumnMetadata, min: number,
    sb: StringBuilder): boolean {
    let rval = true;
    if (typeof value === 'string') {
      if (value.length < min) {
        sb.append(`Text '${value}' may not contain less than ${min} characters.`);
        rval = false;
      }
    } if (typeof value === 'number') {
      if (value < min) {
        sb.append(`${value} may not be less than ${min}.`);
        rval = false;
      }
    } else if (Array.isArray(value)) {
      if (value.length < min) {
        sb.append(`Array [${value.length}] may not contain less than ${min} elements.`);
        rval = false;
      }
    }

    return rval;
  }


  private static isGreaterThan(value: any, property: string | ColumnMetadata, max: number,
    sb: StringBuilder): boolean {
    let rval = true;
    if (typeof value === 'string') {
      if (value.length > max) {
        sb.append(`Text '${value}' may not contain more than ${max} characters.`);
        rval = false;
      }
    } if (typeof value === 'number') {
      if (value > max) {
        sb.append(`${value} may not be greater than ${max}.`);
        rval = false;
      }
    } else if (Array.isArray(value)) {
      if (value.length > max) {
        sb.append(`Array [${value.length}] may not contain more than ${max} elements.`);
        rval = false;
      }
    }

    return rval;
  }
}