import { Assert, Clone, Injectable, IValueReplacer, Types } from '@fluxgate/core';

import { IEntity } from './entity.interface';
import { MetadataStorage } from './metadata/metadataStorage';

/**
 * Value replacer for entity objects.
 *
 * If the given object has a secret property (like password), property value is replaced by a placeholder
 * in the result string.
 *
 * @export
 * @class EntityValueReplacer
 */
@Injectable()
export class EntityValueReplacer implements IValueReplacer {
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
  public replace<TId>(object: any, propertyName: string, propertyValue: any): any {
    Assert.notNull(object);
    Assert.notNullOrEmpty(propertyName);
    Assert.that(!Types.isPrimitive(object), `should not happen: object is primitive`);

    if (!Types.isPresent(propertyValue)) {
      return propertyValue;
    }

    try {
      const ctor = Types.getConstructor(object);

      // if no entity, use JSON.stringify
      const metadata = MetadataStorage.instance.findTableMetadata(ctor);
      if (!metadata) {
        return propertyValue;
      }

      if (metadata.getSecretColumn(propertyName)) {
        return EntityValueReplacer.DEFAULT_SECRET_RESET;
      } else {
        return propertyValue;
      }

    } catch (exc) {
      // no type with constructor
      return propertyValue;
    }
  }
}