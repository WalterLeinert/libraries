import { Dictionary } from './../types/dictionary';
import { Assert } from './../util/assert';

import { PropertyReflector } from './propertyReflector';


export enum ReflectionType {
    Class,
    Number,
    String
}

export class TypeReflector {
    public static NoParent = new TypeReflector({});
    private reflectionType: ReflectionType;
    private propertyDict: Dictionary<string, PropertyReflector> = new Dictionary<string, PropertyReflector>();
    private _parent: TypeReflector;

    constructor(obj: any) {
        Assert.notNull(obj);

        if (typeof obj === 'function') {
            this.reflectionType = ReflectionType.Class;
            // todo

            // alle Properties der Row über Reflection ermitteln        
            const keys = Reflect.ownKeys(obj);

            keys.forEach((key) => {
                const propertyType: Function = (Reflect as any).getMetadata('design:type', obj, key);

                const descr = Reflect.getOwnPropertyDescriptor(obj, key);
                this.propertyDict.set(key.toString(), new PropertyReflector(key.toString(), descr));
            });

            this._parent = Object.getPrototypeOf(obj);
            if (this._parent === Object.prototype) {
                this._parent = TypeReflector.NoParent;
            }
        }
    }

    public get parent(): TypeReflector {
        return this.parent;
    }

    public get propertyReflectors(): PropertyReflector[] {
        return [];      // TODO
    }
}