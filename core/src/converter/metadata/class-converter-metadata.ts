import { Metadata } from '../../base/metadata';
import { Funktion } from '../../base/objectType';
import { Dictionary } from '../../types/dictionary';
import { ConverterKey } from '../converter-key';
import { ConverterRegistry, IConverterTuple } from '../converter-registry';
import { PropertyConverterMetadata } from './property-converter-metadata';

export class ClassConverterMetadata extends Metadata<Funktion> {
  private _propertyMetadata: PropertyConverterMetadata[] = [];
  private _propertyMap: Dictionary<string, PropertyConverterMetadata> =
  new Dictionary<string, PropertyConverterMetadata>();

  constructor(target: Funktion, private _key: ConverterKey) {
    super(target, target.name);
  }

  public add(metadata: PropertyConverterMetadata) {
    this._propertyMetadata.push(metadata);
    this._propertyMap.set(metadata.name, metadata);
  }

  public getPropertyMetadata(name: string): PropertyConverterMetadata {
    return this._propertyMap.get(name);
  }

  public get propertyMetadata(): PropertyConverterMetadata[] {
    return this._propertyMetadata;
  }

  public get key(): ConverterKey {
    return this._key;
  }

  public setConverterKey(key: ConverterKey) {
    this._key = key;
  }

  public getConverterTuple<TFrom, TTo>(): IConverterTuple<TFrom, TTo> {
    return ConverterRegistry.get<TFrom, TTo>(this._key);
  }

}