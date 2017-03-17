import { IValidation, ValidationResult } from '.';
import { Utility } from '../../util/utility';

export abstract class Validator implements IValidation {

  protected constructor() {
  }

  public abstract validate(value: any, propertyName?: string): ValidationResult;

  protected formatPropertyName(propertyName?: string) {
    if (!Utility.isNullOrEmpty(propertyName)) {
      return propertyName + ': ';
    }
    return '';
  }
}