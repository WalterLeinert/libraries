import { ObjectType } from '../../../base/objectType';
import { InstanceAccessor, ShortTime, Time } from '../../../types';
import { Assert } from '../../../util';
import { ColumnTypeUndefinedError } from '../../error/columnTypeUndefinedError';
import { ColumnTypes } from '../../metadata/columnTypes';
import { EnumMetadata } from '../../metadata/enumMetadata';
import { MetadataStorage } from '../../metadata/metadataStorage';


/**
 * Enum-Decorator für Modellproperties/-attribute, deren Werteliste aus einer Tabelle stammen 
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
  dataSource: (type?: any) => ObjectType<T>,
  foreignText: InstanceAccessor<T, TText>,
  foreignId: InstanceAccessor<T, TId>,
) {
  // tslint:disable-next-line:only-arrow-functions
  return function(target: any, propertyName: string) {
    Assert.notNull(dataSource);
    MetadataStorage.instance.addEnumMetadata(
      new EnumMetadata(target.constructor, propertyName, dataSource, foreignText, foreignId));
  };
}