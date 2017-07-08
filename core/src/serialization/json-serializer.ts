// tslint:disable-next-line:no-var-requires
require('reflect-metadata');

import { using } from '../base/disposable';
import { levels } from '../diagnostics/level';
// tslint:disable-next-line:no-unused-variable
import { ILogger } from '../diagnostics/logger.interface';
import { getLogger } from '../diagnostics/logging-core';
import { XLog } from '../diagnostics/xlog';

import { Funktion } from '../base/objectType';
import { ConverterRegistry } from '../converter/converter-registry';
import { Core } from '../diagnostics/core';
import { InvalidOperationException } from '../exceptions/invalidOperationException';
import { NotSupportedException } from '../exceptions/notSupportedException';
import { Types } from '../types/types';
import { Assert } from '../util/assert';
import { SerializerMetadataStorage } from './metadata/serializer-metadata-storage';

/**
 * Definiert eine serialisierte Instanz.
 */
export type Serialized<T extends IJsonSerialization> = T;


/**
 * Interface für den Type-Marker
 *
 * @export
 * @interface IJsonSerialization
 */
export interface IJsonSerialization {
  __type__: string;
}

/**
 * Interface für den Converter Type-Marker
 *
 * @export
 * @interface IJsonConverterSerialization
 */
export interface IJsonConverterSerialization {
  __conv_type__: string;
  __value__: any;
}


/**
 * Formatter zum Serialisieren/Deserialisieren von Typescript Klassen, die mit dem Decorator (Serializable)
 * versehen sind.
 *
 * @export
 * @class JsonSerializer
 */
export class JsonSerializer {
  protected static readonly logger = getLogger(JsonSerializer);

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
   * @memberof JsonSerializer
   */
  public serialize<T>(obj: T): any {
    return using(new XLog(JsonSerializer.logger, levels.INFO, 'serialize',
      `type = ${Types.getTypeName(obj)}`), (log) => {

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
            JsonSerializer.addSerializedType(json, clazzMetadata.name);   // Typ für Deserialiserung hinterlegen
            if (log.isDebugEnabled()) {
              log.debug(`setting type = ${clazzMetadata.name}: obj = ${Core.stringify(obj)}`);
            }
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

            let converted = false;

            if (Types.isPresent(propertyValue) && Types.isObject(propertyValue)) {
              const propertyType = Types.getClassName(propertyValue);

              //
              // Property-Converter ermitteln ...
              //
              const propertyConverter = ConverterRegistry.get(propertyType);

              if (propertyConverter) {

                if (log.isDebugEnabled()) {
                  log.debug(`converting property ${propertyKey.toString()}: type = ${propertyType}, ` +
                    `value = ${Core.stringify(propertyValue)}`);
                }

                //
                // ... und Wert konvertieren und in Json-Hilfsobjekt mit Typinfo einpacken
                //
                propertyValue = JsonSerializer.createSerializedProperty(
                  propertyType, propertyConverter.convert(propertyValue));

                converted = true;
              }
            }

            if (converted) {
              json[propertyKey.toString()] = propertyValue;
            } else {
              json[propertyKey.toString()] = this.serialize(propertyValue);
            }
          }

        } else if (Types.isPrimitive(obj)) {
          json = obj;
        } else {
          throw new NotSupportedException(`Unsupported object: ${Core.stringify(obj)}`);
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
   * @memberof JsonSerializer
   */
  public deserialize<T>(json: any, clazz?: Funktion): T {
    return using(new XLog(JsonSerializer.logger, levels.INFO, 'deserialize'), (log) => {
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
        if (JsonSerializer.isSerialized(json)) {
          const type = JsonSerializer.getSerializedType(json);

          if (log.isInfoEnabled()) {
            if (log.isDebugEnabled()) {
              log.debug(`type = ${type}, json = ${Core.stringify(json)}`);
            } else {
              log.info(`type = ${type}`);
            }
          }

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
        const instance = (clazzMetadata ? clazzMetadata.createInstance() : {});

        // ... und dann die Werte der Zielentity zuweisen
        const propertyKeys = Reflect.ownKeys(json);
        for (const propertyKey of propertyKeys) {
          let propertyValue = json[propertyKey.toString()];


          // interne Typinfo nicht übernehmen
          if (propertyKey.toString() !== JsonSerializer.TYPE_PROPERTY) {

            //
            // falls für den Propertytyp ein Converter existiert, verwenden wir diesen
            //
            let converted = false;

            if (Types.isPresent(propertyValue) && Types.isObject(propertyValue)) {
              if (JsonSerializer.isSerializedProperty(propertyValue)) {
                const propertyType = JsonSerializer.getSerializedPropertyType(propertyValue);
                const value = JsonSerializer.getSerializedPropertyValue(propertyValue);

                //
                // Property-Converter ermitteln ...
                //
                const propertyConverter = ConverterRegistry.get(propertyType);

                if (propertyConverter) {

                  if (log.isDebugEnabled()) {
                    log.debug(`converting property ${propertyKey.toString()}: type = ${propertyType}, ` +
                      `value = ${Core.stringify(propertyValue)}`);
                  }

                  //
                  // ... und Wert zurück konvertieren
                  //
                  propertyValue = propertyConverter.convertBack(value);
                  converted = true;
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
        throw new NotSupportedException(`Unsupported json: ${Core.stringify(json)}`);
      }

      return rval;
    });
  }


  public static isSerialized(json: any): boolean {
    return Types.hasProperty(json, JsonSerializer.TYPE_PROPERTY);
  }

  public static isSerializedProperty(json: any): boolean {
    return Types.hasProperty(json, JsonSerializer.CONVERTER_TYPE_PROPERTY);
  }



  private static getSerializedType(json: any): string {
    return json[JsonSerializer.TYPE_PROPERTY] as string;
  }

  private static addSerializedType(json: any, type: string) {
    json[JsonSerializer.TYPE_PROPERTY] = type;
  }

  private static getSerializedPropertyType(json: any): string {
    return json[JsonSerializer.CONVERTER_TYPE_PROPERTY] as string;
  }

  private static getSerializedPropertyValue(json: any): any {
    return json[JsonSerializer.VALUE_PROPERTY];
  }

  private static createSerializedProperty(type: string, value: any): IJsonConverterSerialization {
    const val: IJsonConverterSerialization = {
      __conv_type__: type,
      __value__: value
    };

    return val;
  }
}