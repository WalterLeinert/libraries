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
    private propertyDict: { [name: string]: PropertyReflector } = {};
    private _parent: TypeReflector;

    constructor(obj: any) {
        Assert.notNull(obj);

        if (typeof obj === 'function') {
            this.reflectionType = ReflectionType.Class;
            // todo

            // alle Properties der Row über Reflection ermitteln        
            let keys = Reflect.ownKeys(obj);

            keys.forEach(key => {
                let propertyType: Function = (Reflect as any).getMetadata('design:type', obj, key);

                let descr = Reflect.getOwnPropertyDescriptor(obj, key);
                this.propertyDict[key.toString()] = new PropertyReflector(key.toString(), descr);
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