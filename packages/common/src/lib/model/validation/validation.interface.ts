
import { ColumnMetadata } from '../metadata/columnMetadata';
import { ValidationResult } from './validationResult';


/**
 * Interface für die modelbasierte Validierung
 *
 * @export
 * @interface IValidation
 */
export interface IValidation {

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
  validate(value: any, property?: string | ColumnMetadata): ValidationResult;
}