// tslint:disable-next-line:no-var-requires
require('reflect-metadata');

import { using } from '../base/disposable';
import { levels } from '../diagnostics/level';
// tslint:disable-next-line:no-unused-variable
import { ILogger } from '../diagnostics/logger.interface';
import { getLogger } from '../diagnostics/logging-core';
import { XLog } from '../diagnostics/xlog';

import { Funktion } from '../base/objectType';
import { InvalidOperationException } from '../exceptions/invalidOperationException';
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
  protected static readonly logger = getLogger(JsonFormatter);

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
    return using(new XLog(JsonFormatter.logger, levels.INFO, 'serialize'), (log) => {

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
          json[JsonFormatter.TYPE_PROPERTY] = clazzMetadata.name;   // Typ für Deserialiserung hinterlegen
          log.debug(`setting type = ${clazzMetadata.name}: obj = ${JSON.stringify(obj)}`);
        }

        const props = Reflect.ownKeys(obj as any);

        // ... und dann die Werte der Zielentity zuweisen
        for (const prop of props) {
          json[prop.toString()] = this.serialize(obj[prop.toString()]);
        }

      } else if (Types.isPrimitive(obj)) {
        json = obj;
      } else {
        throw new NotSupportedException(`Unsupported object: ${JSON.stringify(obj)}`);
      }

      return json;
    });
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
    return using(new XLog(JsonFormatter.logger, levels.INFO, 'deserialize'), (log) => {
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

        let clazzMetadata;

        //
        // liegt im Json-Object Typinformation vor?
        //
        if (Types.hasProperty(json, JsonFormatter.TYPE_PROPERTY)) {
          const type = json[JsonFormatter.TYPE_PROPERTY];

          log.debug(`serializer type = ${type}: json = ${JSON.stringify(json)}`);

          clazzMetadata = SerializerMetadataStorage.instance.findClassMetadata(type);
        }

        //
        // falls eine Zielklasse angegeben ist, muss diese mit dem internen Typ übereinstimmen
        //
        if (clazz) {
          const clazzMeta = SerializerMetadataStorage.instance.findClassMetadata(clazz);
          Assert.notNull(clazzMeta, `No metadata found for type: ${clazz.name}`);

          if (clazzMetadata) {
            if (clazzMeta !== clazzMetadata) {
              throw new InvalidOperationException(`Type infos do not match: ${clazzMetadata.name} - ${clazzMeta.name}`);
            }
          } else {
            clazzMetadata = clazzMeta;
          }
        }

        //
        // falls wir Metadaten haben, können wir eine konkrete Instanz erzeugen, sonst ein native Json-Object
        //
        let instance = (clazzMetadata ? clazzMetadata.createInstance() : {});

        // ... und dann die Werte der Zielentity zuweisen
        const props = Reflect.ownKeys(json);
        for (const prop of props) {
          if (prop.toString() !== JsonFormatter.TYPE_PROPERTY) {
            instance[prop.toString()] = this.deserialize(json[prop.toString()]);
          }
        }

        rval = instance as any as T;
      } else if (Types.isPrimitive(json)) {
        rval = json as T;
      } else {
        throw new NotSupportedException(`Unsupported json: ${JSON.stringify(json)}`);
      }

      return rval;
    });
  }
}