// tslint:disable-next-line:no-var-requires
require('reflect-metadata');

import { PropertySerializerMetadata } from '../metadata/property-serializer-metadata';
import { SerializerMetadataStorage } from '../metadata/serializer-metadata-storage';

export function JsonProperty() {
  // tslint:disable-next-line:only-arrow-functions
  return function (target: any, propertyName: string, descriptor?: PropertyDescriptor) {

    let propertyType: any = (Reflect as any).getMetadata('design:type', target, propertyName);

    // const pd = Reflect.getOwnPropertyDescriptor(target, propertyName);

    SerializerMetadataStorage.instance.addPropertyMetadata(
      new PropertySerializerMetadata(target, propertyName, propertyType));
  };
}