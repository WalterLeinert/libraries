import { Funktion } from '../base/objectType';
import { InvalidOperationException } from '../exceptions/invalidOperationException';
import { Types } from '../types/types';
import { Assert } from '../util/assert';
import { SerializerMetadataStorage } from './metadata/serializer-metadata-storage';

export interface IJsonSerialization {
  __type__: string;
}


export class JsonFormatter {

  public static readonly TYPE_PROPERTY = '__type__';

  public serialize<T>(obj: T): any {
    if (!Types.isPresent(obj)) {
      return obj;
    }

    let json: any;

    if (Types.isObject(obj)) {
      json = {};

      const clazz = (obj as Object).constructor;

      const clazzMetadata = SerializerMetadataStorage.instance.findClassMetadata(clazz);

      clazzMetadata.propertyMetadata.forEach((prop) => {
        json[prop.name] = obj[prop.name];
      });

      return json;

    } else if (Types.isArray(obj)) {
      const ar = obj as any as any[];

      json = [];

      ar.forEach((a) => {
        json.push(this.serialize(a));
      });

    } else if (Types.isPrimitive(obj)) {
      json = obj;
    }

    return json;
  }


  public deserialize<T>(json: any, clazz?: Funktion): T {
    Assert.notNull(json);

    let rval: T;

    if (clazz) {
      const clazzMetadata = SerializerMetadataStorage.instance.findClassMetadata(clazz);
      Assert.notNull(clazzMetadata, `No metadata found for type: ${clazz.name}`);

      const instance = clazzMetadata.createInstance();

      clazzMetadata.propertyMetadata.forEach((prop) => {
        instance[prop.name] = json[prop.name];
      });

      rval = instance as T;
    } else {
      rval = json as T;
    }

    return rval;
  }
}