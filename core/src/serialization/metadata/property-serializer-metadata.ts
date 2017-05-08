import { PropertyMetadata } from '../../metadata/property-metadata';

export class PropertySerializerMetadata extends PropertyMetadata {

  constructor(target: Object, name: string, private _type: any) {
    super(target, name);
  }

  public get type(): any {
    return this._type;
  }
}