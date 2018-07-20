import { Assertion } from '../base/assertion';
import { Funktion, ObjectType } from '../base/objectType';
import { Utility } from '../util/utility';

/**
 * modelliert ein Byte.
 */
export type byte = number;

/**
 * modelliert einen String mit Base64-Kodierung
 */
export type base64 = string;


export class Types {

  public static isString(obj: any): boolean {
    return typeof obj === 'string';
  }

  public static isBoolean(obj: any): boolean {
    return typeof obj === 'boolean';
  }

  public static isNumber(obj: any): boolean {
    return typeof obj === 'number';
  }

  public static isFunction(obj: any): boolean {
    return typeof obj === 'function';
  }

  public static isSymbol(obj: any): boolean {
    return typeof obj === 'symbol';
  }

  public static isObject(obj: any): boolean {
    return typeof obj === 'object';
  }

  public static isArray(obj: any): boolean {
    return Array.isArray(obj);
  }

  public static isNull(obj: any): boolean {
    return obj === null;
  }

  public static isUndefined(obj: any): boolean {
    return obj === undefined;
  }

  /**
   * Liefert true, falls @param{obj} nicht null oder undefined ist.
   *
   * @static
   * @param {*} obj
   * @returns {boolean}
   *
   * @memberOf Types
   */
  public static isPresent(obj: any): boolean {
    return !(Types.isNull(obj) || Types.isUndefined(obj));
  }

  public static isPrimitive(obj: any): boolean {
    return (Types.isString(obj) || Types.isNumber(obj) || Types.isBoolean(obj)
      || Types.isSymbol(obj) || Types.isUndefined(obj));
  }




  public static hasMethod(obj: any, methodName: string): boolean {
    Assertion.notNull(obj);
    Assertion.notNullOrEmpty(methodName);
    return !Types.isUndefined(obj[methodName]) && Types.isFunction(obj[methodName]);
  }

  public static hasProperty(obj: any, propertyName: string): boolean {
    Assertion.notNull(obj);
    Assertion.notNullOrEmpty(propertyName);
    return !Types.isUndefined(obj[propertyName]);
  }


  /**
   * Liefert die Constructor-Methode für @param{obj}.
   * Obj muss ein Object sein.
   *
   * @static
   * @param {*} obj
   * @returns {Funktion}
   *
   * @memberof Types
   */
  public static getConstructor(obj: any): Funktion {
    Assertion.notNull(obj);
    Assertion.that(Types.isObject(obj));
    return obj.constructor;
  }


  /**
   * Liefert den Klassennamen von @param{obj}
   * Obj muss ein Object sein.
   *
   * @static
   * @param {*} obj
   * @returns {string}
   *
   * @memberof Types
   */
  public static getClassName(obj: any): string {
    return Types.getConstructor(obj).name;
  }


  /**
   * Liefert den Typnamen des Objekts @param{obj}.
   *
   * @static
   * @param {*} obj
   * @returns {string}
   *
   * @memberof Types
   */
  public static getTypeName(obj: any): string {
    if (Types.isNull(obj)) {
      return '-null-';
    } else if (Types.isUndefined(obj)) {
      return '-undefined-';
    } else if (Types.isPrimitive(obj)) {
      return typeof obj;
    } else if (Types.isObject(obj)) {
      return Types.getClassName(obj);
    } else {
      return '-unknown-';
    }
  }


  /**
   * Liefert true, falls @see{clazz} über den Operator new eine Instanz erzeugen kann.
   *
   * @static
   * @param {*} clazz
   * @returns {boolean}
   *
   * @memberof Types
   */
  public static hasConstructor(clazz: any): boolean {
    Assertion.notNull(clazz);
    try {
      // tslint:disable-next-line:no-unused-expression
      new clazz();
      return true;
    } catch (exc) {
      return false;
    }
  }


  /**
   * Liefert die Basisklasse von @see{class} (als Prototype von clazz)
   *
   * @static
   * @param {*} clazz
   * @returns {*}
   *
   * @memberof Types
   */
  public static getBaseClass(clazz: any): Funktion {
    const prototype = Object.getPrototypeOf(clazz);

    if (prototype) {
      if (!Types.isNullOrEmpty(prototype.name)) {
        return prototype;
      }
      return undefined;
    }
    return undefined;
  }


  /**
   * Erzeugt eine neue Instanz für die "Klasse" @param{clazz} über die "constructor" function
   * -> simuliert den default constructor
   *
   * @static
   * @template T
   * @param {Object} obj
   * @returns {*}
   *
   * @memberOf Types
   */
  public static construct<T>(clazz: ObjectType<T>): T {
    return new ((clazz as any).constructor)() as T;
  }


  /**
   * Liefert true, falls @param {value} null oder leer ist.
   */
  public static isNullOrEmpty<T extends { length: number }>(value: T) {
    return Utility.isNullOrEmpty(value);
  }


  /**
   * Liefert das Objekt @param{obj} als Instanz vom Typ T
   *
   * @static
   * @template T
   * @param {*} obj
   * @returns {T}
   *
   * @memberof Types
   */
  public static cast<T>(obj: any): T {
    return (obj as any) as T;
  }

}