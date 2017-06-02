import { Types, Utility } from '@fluxgate/core';

import { ColumnMetadata } from '../metadata/columnMetadata';
import { IValidation } from './validation.interface';
import { ValidationResult } from './validationResult';

export abstract class Validator implements IValidation {

  /**
   * Creates an instance of Validator.
   *
   * @param {string} [_info] - optionale Meldungsinformation
   *
   * @memberof Validator
   */
  protected constructor(private _info?: string) {
  }


  /**
   * Validiert einen Wert @param{value} der Property @param{property} und liefert
   * ein Validierungsergebnis.
   *
   * @param {*} value
   * @param {(string | ColumnMetadata)} [property] - Propertyname oder ColumnMetadata.
   * @returns {ValidationResult}
   *
   * @memberof IValidation
   */
  public abstract validate(value: any, property?: string | ColumnMetadata): ValidationResult;


  public formatPropertyName(property?: string | ColumnMetadata) {
    if (Types.isPresent(property)) {
      let name: string;
      if (property instanceof ColumnMetadata) {
        name = property.propertyName;
      } else {
        name = property;
      }
      return name + ': ';
    }
    return '';
  }

  /**
   * optional: spezielle Validierungsmeldung
   *
   * @type {string}
   * @memberof IValidation
   */
  public get info(): string {
    return this._info;
  }
}