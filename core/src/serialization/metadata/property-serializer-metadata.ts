import { PropertyMetadata } from '../../metadata/property-metadata';

export class PropertySerializerMetadata extends PropertyMetadata<object> {

  // tslint:disable-next-line:ban-types
  constructor(target: Object, name: string, private _serializable: boolean) {
    super(target, name);
  }

  public get serializable(): boolean {
    return this._serializable;
  }
}