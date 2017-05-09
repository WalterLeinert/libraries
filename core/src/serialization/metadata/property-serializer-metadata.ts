import { PropertyMetadata } from '../../metadata/property-metadata';

export class PropertySerializerMetadata extends PropertyMetadata {

  constructor(target: Object, name: string, private _type: any, private _serializable: boolean) {
    super(target, name);
  }

  public get type(): any {
    return this._type;
  }

  public get serializable(): boolean {
    return this._serializable;
  }
}