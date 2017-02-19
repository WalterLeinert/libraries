import { IUniqueIdentifiable } from './uniqueIdentifiable.interface';

export abstract class UniqueIdentifiable implements IUniqueIdentifiable {
  private static __id = 0;
  private _instanceId;

  protected constructor() {
    this._instanceId = UniqueIdentifiable.__id++;
  }


  public get instanceId(): number {
    return this._instanceId;
  }
}