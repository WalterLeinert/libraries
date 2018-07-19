import { IUniqueIdentifiable } from './uniqueIdentifiable.interface';

export abstract class Identifiable implements IUniqueIdentifiable {
  public abstract get instanceId(): number;
}

// tslint:disable-next-line:max-classes-per-file
export abstract class UniqueIdentifiable extends Identifiable {
  // tslint:disable-next-line:variable-name
  private static __id = 0;
  private _instanceId;

  protected constructor() {
    super();
    this._instanceId = UniqueIdentifiable.__id++;
  }


  public get instanceId(): number {
    return this._instanceId;
  }
}