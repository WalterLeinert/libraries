import { PropertyReflector } from './propertyReflector';
export declare enum ReflectionType {
    Class = 0,
    Number = 1,
    String = 2,
}
export declare class TypeReflector {
    static NoParent: TypeReflector;
    private reflectionType;
    private propertyDict;
    private _parent;
    constructor(obj: any);
    readonly parent: TypeReflector;
    readonly propertyReflectors: PropertyReflector[];
}
