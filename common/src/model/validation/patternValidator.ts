import { Assert, StringBuilder, Types } from '@fluxgate/core';

import { ColumnMetadata } from '../metadata/columnMetadata';
import { ValidationResult } from './validationResult';
import { Validator } from './validator';


export class PatternValidator extends Validator {
  private regex: RegExp;

  constructor(private _pattern: string, info?: string) {
    super(info);
    Assert.notNullOrEmpty(_pattern);
    this.regex = new RegExp(_pattern);
  }

  public validate(value: string, property?: string | ColumnMetadata): ValidationResult {
    if (!Types.isPresent(value)) {
      return ValidationResult.Ok;
    }
    Assert.that(Types.isString(value));

    const matchResult = value.match(this.regex);

    if (matchResult === null) {
      return ValidationResult.create(this, property, false, `does not match "${this.pattern}"`);
    }

    return ValidationResult.Ok;
  }

  public get pattern(): string {
    return this._pattern;
  }
}