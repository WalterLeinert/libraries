import { Utility } from '../../util/utility';
import { IValidation } from './validation.interface';
import { ValidationResult } from './validationResult';

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