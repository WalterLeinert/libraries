import { Metadata } from '../../base/metadata';

export class PropertyMetadata extends Metadata<Object> {

  constructor(target: Object, name: string, private _type: any) {
    super(target, name);
  }

  public get type(): any {
    return this._type;
  }
}