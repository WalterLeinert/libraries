import { Funktion } from '../../base/objectType';
import { Validator } from '../validation/validator';

/**
 * Metadaten zur Validierung von Attributen
 *
 * @export
 * @class ValidationMetadata
 */
export class ValidationMetadata {
  constructor(public target: Funktion, public propertyName: string, public validator: Validator) {
  }
}