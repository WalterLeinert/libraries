// tslint:disable-next-line:no-var-requires
require('reflect-metadata');

import { using } from '../base/disposable';
import { levels } from '../diagnostics/level';
// tslint:disable-next-line:no-unused-variable
import { ILogger } from '../diagnostics/logger.interface';
import { getLogger } from '../diagnostics/logging-core';
import { XLog } from '../diagnostics/xlog';

import { Funktion } from '../base/objectType';
import { ConverterMetadataStorage } from '../converter/metadata/converter-metadata-storage';
import { InvalidOperationException } from '../exceptions/invalidOperationException';
import { NotSupportedException } from '../exceptions/notSupportedException';
import { Types } from '../types/types';
import { Assert } from '../util/assert';
import { SerializerMetadataStorage } from './metadata/serializer-metadata-storage';

export interface IJsonSerialization {
  __type__: string;
}

export interface IJsonConverterSerialization {
  __conv_type__: string;
  __value__: any;
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
  public static readonly CONVERTER_TYPE_PROPERTY = '__conv_type__';
  public static readonly VALUE_PROPERTY = '__value__';


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

        const clazzName = Types.getClassName(obj);
        const clazzMetadata = SerializerMetadataStorage.instance.findClassMetadata(clazzName);

        // JsonClass?
        if (clazzMetadata) {
          json[JsonFormatter.TYPE_PROPERTY] = clazzMetadata.name;   // Typ für Deserialiserung hinterlegen
          log.debug(`setting type = ${clazzMetadata.name}: obj = ${JSON.stringify(obj)}`);
        }

        const propertyKeys = Reflect.ownKeys(obj as any);

        // ... und dann die Werte der Zielentity zuweisen
        for (const propertyKey of propertyKeys) {
          let propertyValue = obj[propertyKey.toString()];

          if (clazzMetadata) {
            const propertyMetadata = clazzMetadata.getPropertyMetadata(propertyKey.toString());
            if (propertyMetadata && !propertyMetadata.serializable) {
              continue;
            }
          }

          //
          // falls für den Propertytyp ein Converter existiert, verwenden wir diesen
          //

          if (Types.isObject(propertyValue)) {
            const propertyClassName = Types.getClassName(propertyValue);

            const classConverterMetadata = ConverterMetadataStorage.instance
              .findClassConverterMetadata(propertyClassName);

            if (classConverterMetadata) {
              //
              // Property-Converter ermitteln und Wert konvertieren und in Json-Hilfsobjekt mit Typinfo einpacken
              //
              const propertyConverterTuple = classConverterMetadata.getConverterTuple();
              if (propertyConverterTuple) {
                const val: IJsonConverterSerialization = {
                  __conv_type__: propertyClassName,
                  __value__: propertyConverterTuple.to.convert(propertyValue)
                };

                propertyValue = val;
              }
            }
          }

          json[propertyKey.toString()] = this.serialize(propertyValue);
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
        const propertyKeys = Reflect.ownKeys(json);
        for (const propertyKey of propertyKeys) {
          let propertyValue = json[propertyKey.toString()];


          // interne Typinfo nicht übernehmen
          if (propertyKey.toString() !== JsonFormatter.TYPE_PROPERTY) {

            //
            // falls für den Propertytyp ein Converter existiert, verwenden wir diesen
            //
            let converted = false;

            if (Types.isObject(propertyValue)) {
              if (Types.hasProperty(propertyValue, JsonFormatter.CONVERTER_TYPE_PROPERTY)) {
                const propertyType = propertyValue[JsonFormatter.CONVERTER_TYPE_PROPERTY];
                const value = propertyValue[JsonFormatter.VALUE_PROPERTY];

                const classConverterMetadata = ConverterMetadataStorage.instance
                  .findClassConverterMetadata(propertyType);

                if (classConverterMetadata) {
                  // Property-Converter ermitteln und Wert konvertieren
                  const propertyConverterTuple = classConverterMetadata.getConverterTuple();
                  if (propertyConverterTuple) {
                    propertyValue = propertyConverterTuple.from.convert(value);
                    converted = true;
                  }
                }
              }
            }

            if (converted) {
              instance[propertyKey.toString()] = propertyValue;     // bereits "deserialisiert"
            } else {
              instance[propertyKey.toString()] = this.deserialize(propertyValue);
            }
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