import { Assert } from './../util/assert';

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

    public static isNull(obj: any): boolean {
        return typeof obj === null;
    }

    public static isUndefined(obj: any): boolean {
        return typeof obj === undefined;
    }

    public static hasMethod(obj: any, method: Function): boolean {
        Assert.notNull(obj);
        return obj.method !== undefined;
    }
}