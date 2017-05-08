import { Funktion, ObjectType } from '../base/objectType';
import { Assert } from '../util/assert';
import { Utility } from '../util/utility';


export type byte = number;

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
    Assert.notNull(obj);
    Assert.notNullOrEmpty(methodName);
    return !Types.isUndefined(obj[methodName]) && Types.isFunction(obj[methodName]);
  }

  public static hasProperty(obj: any, propertyName: string): boolean {
    Assert.notNull(obj);
    Assert.notNullOrEmpty(propertyName);
    return !Types.isUndefined(obj[propertyName]);
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
    Assert.notNull(clazz);
    try {
      // tslint:disable-next-line:no-unused-new
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

}