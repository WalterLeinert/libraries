// tslint:disable-next-line:no-var-requires
require('reflect-metadata');

import { Assert } from '../util/assert';
import { Utility } from '../util/utility';
import { ClassSerializerMetadata } from './metadata/class-serializer-metadata';
import { PropertySerializerMetadata } from './metadata/property-serializer-metadata';
import { SerializerMetadataStorage } from './metadata/serializer-metadata-storage';


/**
 * Definiert die Serialisierbarkeit (Json) von Klassen
 *
 * @export
 * @param {boolean} [serializable=true] - steuert, ob Property serialisiert wird
 * @returns
 */
export function Serializable(serializable: boolean = true) {
  // tslint:disable-next-line:only-arrow-functions
  return function (target: any, propertyName?: string, descriptor?: PropertyDescriptor) {

    if (Utility.isNullOrEmpty(propertyName)) {
      Assert.that(serializable === true, `serialiable may not be set to false for classes`);
      SerializerMetadataStorage.instance.addClassMetadata(new ClassSerializerMetadata(target));
    } else {
      let propertyType: any = (Reflect as any).getMetadata('design:type', target, propertyName);

      // const pd = Reflect.getOwnPropertyDescriptor(target, propertyName);

      SerializerMetadataStorage.instance.addPropertyMetadata(
        new PropertySerializerMetadata(target, propertyName, propertyType, serializable));
    }
  };
}