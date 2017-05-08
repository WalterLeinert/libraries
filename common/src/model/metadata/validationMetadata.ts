import { Funktion, PropertyMetadata } from '@fluxgate/core';

import { Validator } from '../validation/validator';

/**
 * Metadaten zur Validierung von Attributen
 *
 * @export
 * @class ValidationMetadata
 */
export class ValidationMetadata extends PropertyMetadata {
  constructor(target: Funktion, public propertyName: string, public validator: Validator) {
    super(target, propertyName);
  }
}