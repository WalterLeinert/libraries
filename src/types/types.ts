import { Assert } from './../util/assert';

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
}