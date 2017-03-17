import { StringBuilder } from '../../base';
import { Assert } from '../../util/assert';
import { Utility } from '../../util/utility';
import { ValidationResult } from './validationResult';
import { Validator } from './validator';


export class PatternValidator extends Validator {
  private regex: RegExp;

  constructor(private pattern: string, private info?: string) {
    super();
    Assert.notNullOrEmpty(pattern);
    this.regex = new RegExp(pattern);
  }

  public validate(value: string, propertyName?: string): ValidationResult {
    const sb = new StringBuilder(this.formatPropertyName(propertyName));

    if (Utility.isNullOrEmpty(value)) {
      return ValidationResult.Ok;
    }

    const matchResult = value.match(this.regex);

    if (matchResult === null) {
      if (this.info !== undefined) {
        sb.append(this.info);
      } else {
        sb.append(`does not match "${this.pattern}"`);
      }
      return ValidationResult.create(false, sb.toString());
    }

    return ValidationResult.Ok;
  }
}