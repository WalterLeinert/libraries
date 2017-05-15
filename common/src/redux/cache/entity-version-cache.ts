import { Assert, Dictionary } from '@fluxgate/core';

export class EntityVersionCache {
  public static instance = new EntityVersionCache();

  private entityDict: Dictionary<string, EntityVersionCacheEntry<any>> =
  new Dictionary<string, EntityVersionCacheEntry<any>>();

  public set<T>(entity: string, cacheEntry: EntityVersionCacheEntry<T>) {
    Assert.notNullOrEmpty(entity);
    Assert.notNull(cacheEntry);

    this.entityDict.set(entity, cacheEntry);
  }

  public get<T>(entity: string): EntityVersionCacheEntry<T> {
    Assert.notNullOrEmpty(entity);

    return this.entityDict.get(entity);
  }


  public reset() {
    this.entityDict.clear();
  }
}


// tslint:disable-next-line:max-classes-per-file
export class EntityVersionCacheEntry<T> {
  private _version: number;
  private _items: T[];

  constructor(version: number, items: T[]) {
    this._version = version;
    this._items = [...items];
  }

  public get version(): number {
    return this._version;
  }

  public get items(): T[] {
    return [...this._items];
  }
}