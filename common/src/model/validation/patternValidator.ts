import { Assert, StringBuilder, Utility } from '@fluxgate/core';

import { ValidationResult } from './validationResult';
import { Validator } from './validator';


export class PatternValidator extends Validator {
  private regex: RegExp;

  constructor(private _pattern: string, private _info?: string) {
    super();
    Assert.notNullOrEmpty(_pattern);
    this.regex = new RegExp(_pattern);
  }

  public validate(value: string, propertyName?: string): ValidationResult {
    const sb = new StringBuilder(this.formatPropertyName(propertyName));

    if (Utility.isNullOrEmpty(value)) {
      return ValidationResult.Ok;
    }

    const matchResult = value.match(this.regex);

    if (matchResult === null) {
      if (this._info !== undefined) {
        sb.append(this._info);
      } else {
        sb.append(`does not match "${this.pattern}"`);
      }
      return ValidationResult.create(false, sb.toString());
    }

    return ValidationResult.Ok;
  }

  public get pattern(): string {
    return this._pattern;
  }

  public get info(): string {
    return this._info;
  }
}