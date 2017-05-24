import { Assert, ICtor, InstanceAccessor } from '@fluxgate/core';

import { EnumMetadata } from '../metadata/enumMetadata';
import { MetadataStorage } from '../metadata/metadataStorage';


/**
 * Decorator: definiert eine Modellproperty, deren Werteliste aus einer Tabelle stammt
 *
 * @export
 * @template T
 * @param {(type?: any) => ObjectType<T>} dataSource - die Modelklasse (Function)
 * @param {(string | ((object: T) => any))} foreignText - Propertyselektor in Modelklasse für
 * Text-Property (-> textField)
 * @param {(string | ((object: T) => any))} foreignId - Propertyselektor in Modelklasse für
 * Id-Property (-> valueField)
 * @returns
 */
export function Enum<T, TText, TId>(
  dataSource: (type?: T) => ICtor<T>,
  foreignText: InstanceAccessor<T, TText>,
  foreignId: InstanceAccessor<T, TId>,
  cacheable: boolean = false
) {
  // tslint:disable-next-line:only-arrow-functions
  return function (target: Object, propertyName: string) {
    Assert.notNull(dataSource);
    MetadataStorage.instance.addEnumMetadata(
      new EnumMetadata(target.constructor, propertyName, dataSource, foreignText, foreignId, cacheable));
  };
}