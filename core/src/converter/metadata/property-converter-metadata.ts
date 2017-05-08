import { Metadata } from '../../base/metadata';
import { ConverterKey } from '../converter-key';

export class PropertyConverterMetadata extends Metadata<Object> {

  constructor(target: Object, name: string, private _type: any, private _key: ConverterKey) {
    super(target, name);
  }

  public get type(): any {
    return this._type;
  }

  public get key(): ConverterKey {
    return this._key;
  }
}