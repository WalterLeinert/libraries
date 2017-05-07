import { PropertyMetadata } from '../metadata/property-metadata';
import { SerializerMetadataStorage } from '../metadata/serializer-metadata-storage';

export function JsonProperty() {
  // tslint:disable-next-line:only-arrow-functions
  return function (target: any, propertyKey: string, descriptor?: PropertyDescriptor) {

    const pd = Reflect.getOwnPropertyDescriptor(target, propertyKey);

    SerializerMetadataStorage.instance.addPropertyMetadata(new PropertyMetadata(target, propertyKey));
  };
}