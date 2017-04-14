import { ObjectType } from '../base/objectType';
export declare type byte = number;
export declare class Types {
    static isString(obj: any): boolean;
    static isBoolean(obj: any): boolean;
    static isNumber(obj: any): boolean;
    static isFunction(obj: any): boolean;
    static isSymbol(obj: any): boolean;
    static isObject(obj: any): boolean;
    static isArray(obj: any): boolean;
    static isNull(obj: any): boolean;
    static isUndefined(obj: any): boolean;
    /**
     * Liefert true, falls @param{obj} nicht null oder undefined ist.
     *
     * @static
     * @param {*} obj
     * @returns {boolean}
     *
     * @memberOf Types
     */
    static isPresent(obj: any): boolean;
    static isPrimitive(obj: any): boolean;
    static hasMethod(obj: any, methodName: string): boolean;
    static hasProperty(obj: any, propertyName: string): boolean;
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
    static construct<T>(clazz: ObjectType<T>): T;
}
