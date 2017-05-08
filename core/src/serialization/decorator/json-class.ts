import { ClassSerializerMetadata } from '../metadata/class-serializer-metadata';
import { SerializerMetadataStorage } from '../metadata/serializer-metadata-storage';

export function JsonClass() {
  // tslint:disable-next-line:only-arrow-functions
  return function (target: any) {
    SerializerMetadataStorage.instance.addClassMetadata(new ClassSerializerMetadata(target));
  };
}