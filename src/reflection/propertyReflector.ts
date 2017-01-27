import { Assert } from './../util/assert';

export class PropertyReflector {
    constructor(private _name: string, private _descriptor: PropertyDescriptor) {
        Assert.notNull(_descriptor);
    }

    get name(): string {
        return this._name;
    }

    public get descriptor(): PropertyDescriptor {
        return this._descriptor;
    }
}