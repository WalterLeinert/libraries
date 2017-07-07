import { Clone, IStringifyer, JsonDumper } from '@fluxgate/core';

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
  public stringify<TId>(entity: IEntity<TId>, resetSecrets: boolean = true): string {
    if (resetSecrets) {
      const clone = Clone.clone(entity);
      MetadataStorage.instance.resetSecrets(clone, EntityStringifyer.DEFAULT_SECRET_RESET);
      entity = clone;
    }

    return JSON.stringify(entity);
  }
}