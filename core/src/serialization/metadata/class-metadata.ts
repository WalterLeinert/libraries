import { Metadata } from '../../base/metadata';
import { Funktion } from '../../base/objectType';
import { Dictionary } from '../../types/dictionary';
import { PropertyMetadata } from './property-metadata';

export class ClassMetadata extends Metadata<Funktion> {
  private _propertyMetadata: PropertyMetadata[] = [];
  private _propertyMap: Dictionary<string, PropertyMetadata> = new Dictionary<string, PropertyMetadata>();

  constructor(target: Funktion) {
    super(target, target.name);
  }

  public add(metadata: PropertyMetadata) {
    this._propertyMetadata.push(metadata);
    this._propertyMap.set(metadata.name, metadata);
  }


  public createInstance<T>(...args: any[]) {
    return Reflect.construct(this.target as (() => void), args) as T;
  }


  public getPropertyMetadata(name: string): PropertyMetadata {
    return this._propertyMap.get(name);
  }

  public get propertyMetadata(): PropertyMetadata[] {
    return this._propertyMetadata;
  }

}