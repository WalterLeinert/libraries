import { Funktion } from '../../base/objectType';
import { ClassMetadata } from '../../metadata/class-metadata';
import { Dictionary } from '../../types/dictionary';
import { PropertySerializerMetadata } from './property-serializer-metadata';

export class ClassSerializerMetadata extends ClassMetadata {
  private _propertyMetadata: PropertySerializerMetadata[] = [];
  private _propertyMap: Dictionary<string, PropertySerializerMetadata> =
  new Dictionary<string, PropertySerializerMetadata>();

  constructor(target: Funktion) {
    super(target);
  }

  public add(metadata: PropertySerializerMetadata) {
    this._propertyMetadata.push(metadata);
    this._propertyMap.set(metadata.name, metadata);
  }


  public createInstance<T>(...args: any[]) {
    return Reflect.construct(this.target as (() => void), args) as T;
  }


  public getPropertyMetadata(name: string): PropertySerializerMetadata {
    return this._propertyMap.get(name);
  }

  public get propertyMetadata(): PropertySerializerMetadata[] {
    return this._propertyMetadata;
  }

}