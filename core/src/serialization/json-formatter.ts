// tslint:disable-next-line:no-var-requires
require('reflect-metadata');

import { Funktion } from '../base/objectType';
import { NotSupportedException } from '../exceptions/notSupportedException';
import { Types } from '../types/types';
import { Assert } from '../util/assert';
import { SerializerMetadataStorage } from './metadata/serializer-metadata-storage';

export interface IJsonSerialization {
  __type__: string;
}


/**
 * Formatter zum Serialisieren/Deserialisieren von Typescript Klassen, die mit Decoratoren (JsonClass, JsonProperty)
 * versehen sind.
 *
 * @export
 * @class JsonFormatter
 */
export class JsonFormatter {

  public static readonly TYPE_PROPERTY = '__type__';


  /**
   * Serialisiert das Object @param{obj} vom Typ @type{T} in ein einfach Json-Object.
   *
   * Metadaten werden ausgewertet, die über die Decoratoren JsonClass/-Property erzeugt wurden.
   *
   * @template T
   * @param {T} obj
   * @returns {*}
   *
   * @memberof JsonFormatter
   */
  public serialize<T>(obj: T): any {
    if (!Types.isPresent(obj)) {
      return obj;
    }

    let json: any;


    if (Types.isArray(obj)) {
      /**
       * alle Elemente einzeln serialisieren
       */

      const ar = obj as any as any[];

      json = [];

      ar.forEach((a) => {
        json.push(this.serialize(a));
      });

    } else if (Types.isObject(obj)) {

      /**
       * Falls Metadaten vorhanden, über Metadaten serialisieren; sonst über Reflection
       */

      json = {};

      const clazz = (obj as Object).constructor;

      const clazzMetadata = SerializerMetadataStorage.instance.findClassMetadata(clazz);

      // JsonClass?
      if (clazzMetadata) {
        clazzMetadata.propertyMetadata.forEach((prop) => {
          json[prop.name] = this.serialize(obj[prop.name]);
        });
      } else {
        const props = Reflect.ownKeys(obj as any);

        // ... und dann die Werte der Zielentity zuweisen
        for (const prop of props) {
          json[prop.toString()] = this.serialize(obj[prop.toString()]);
        }
      }

    } else if (Types.isPrimitive(obj)) {
      json = obj;
    } else {
      throw new NotSupportedException(`Unsupported object: ${JSON.stringify(obj)}`);
    }

    return json;
  }


  /**
   * Deserialisiert ein einfaches Json-Object in eine Instanz der Klasse vom Typ @type{T}.
   *
   * Metadaten werden ausgewertet, die über die Decoratoren JsonClass/-Property erzeugt wurden.
   *
   * @template T
   * @param {*} json
   * @param {Funktion} [clazz]
   * @returns {T}
   *
   * @memberof JsonFormatter
   */
  public deserialize<T>(json: any, clazz?: Funktion): T {
    if (!Types.isPresent(json)) {
      return json;
    }

    let rval: T;

    if (Types.isArray(json)) {
      const ar = json as any[];

      const arr = [];
      ar.forEach((a) => {
        arr.push(this.deserialize(a, clazz));
      });

      rval = arr as any as T;

    } else if (Types.isObject(json)) {

      if (clazz) {
        const clazzMetadata = SerializerMetadataStorage.instance.findClassMetadata(clazz);
        Assert.notNull(clazzMetadata, `No metadata found for type: ${clazz.name}`);

        const instance = clazzMetadata.createInstance();

        clazzMetadata.propertyMetadata.forEach((prop) => {

          //
          // wir prüfen, ob der Propertytyp ein serialisierbares Objekt ist
          //
          let propClazz = prop.type;

          let propClazzMetadata;
          if (propClazz) {
            propClazzMetadata = SerializerMetadataStorage.instance.findClassMetadata(propClazz);
            if (!propClazzMetadata) {
              propClazz = undefined;  // nicht durch JsonFormatter deserialisierbar
            }
          }

          instance[prop.name] = this.deserialize(json[prop.name], propClazz);
        });

        rval = instance as T;
      } else {
        const jsonClazz = (json as Object).constructor;

        const jsonClazzMetadata = SerializerMetadataStorage.instance.findClassMetadata(jsonClazz);
        if (jsonClazzMetadata) {
          const instance = jsonClazzMetadata.createInstance();

          jsonClazzMetadata.propertyMetadata.forEach((prop) => {
            instance[prop.name] = this.serialize(json[prop.name]);
          });

          rval = instance as T;
        } else {

          rval = json as T;
        }

      }
    } else if (Types.isPrimitive(json)) {
      rval = json as T;
    } else {
      throw new NotSupportedException(`Unsupported json: ${JSON.stringify(json)}`);
    }

    return rval;
  }
}