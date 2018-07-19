import { IStringifyer, JsonDumper, Types } from '@fluxgate/core';

import { MetadataStorage } from './metadata/metadataStorage';

/**
 * Helper class to create an json string for the given entity (like JSON.stringify).
 * If the entity has secret properties (like password), these properties are reset
 * in the result string.
 *
 * @export
 * @class EntityStringifyer
 */
export class EntityStringifyer implements IStringifyer {
  public static readonly DEFAULT_SECRET_RESET = '*****';

  /**
   * Creates an json string for the given @param{value}. It uses @param{JsonDumper} to
   * stringify the value, which should be configured to use @see{EntityValueReplacer} to reset secret
   * propertyies (like password).
   *
   * @static
   * @returns {string}
   */
  public stringify(value: any): string {
    return JsonDumper.stringify(value);
  }
}