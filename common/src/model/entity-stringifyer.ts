import { Clone, IStringifyer, Types } from '@fluxgate/core';

import { IEntity } from './entity.interface';
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
   * Creates an json string for the given entity @param{entity}. If @param{resetSecrets} is true,
   * secret properties are reset in result string if the properties are decorated as secret in
   * the model class.
   *
   * @static
   * @template TId
   * @param {IEntity<TId>} entity
   * @param {boolean} [resetSecrets=true]
   * @returns {string}
   * @memberof EntityDumper
   */
  public stringify<TId>(value: IEntity<TId>, resetSecrets: boolean = true): string {
    if (!Types.isPresent(value) || Types.isPrimitive(value)) {
      return JSON.stringify(value);
    }

    try {
      const ctor = Types.getConstructor(value);

      // if no entity, use JSON.stringify
      const metadata = MetadataStorage.instance.findTableMetadata(ctor);
      if (!metadata) {
        return JSON.stringify(value);
      }
    } catch (exc) {
      // no type with constructor
      return JSON.stringify(value);
    }

    if (resetSecrets) {
      const clone = Clone.clone(value);
      MetadataStorage.instance.resetSecrets(clone, EntityStringifyer.DEFAULT_SECRET_RESET);
      value = clone;
    }

    return JSON.stringify(value);
  }
}