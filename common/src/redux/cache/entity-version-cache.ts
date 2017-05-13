import { Assert, Dictionary } from '@fluxgate/core';

import { EntityVersion } from '../../model/entityVersion';

export class EntityVersionCache {
  public static instance = new EntityVersionCache();

  private entityDict: Dictionary<string, EntityVersionCacheEntry<any>> =
  new Dictionary<string, EntityVersionCacheEntry<any>>();

  public add<T>(entity: string, cacheEntry: EntityVersionCacheEntry<T>) {
    Assert.notNullOrEmpty(entity);
    Assert.notNull(cacheEntry);

    this.entityDict.set(entity, cacheEntry);
  }

  public get<T>(entity: string): EntityVersionCacheEntry<T> {
    Assert.notNullOrEmpty(entity);

    return this.entityDict.get(entity);
  }
}


// tslint:disable-next-line:max-classes-per-file
export class EntityVersionCacheEntry<T> {

  constructor(private _entityVersion: EntityVersion, private _items: T[]) {
  }

  public get entityVersion(): EntityVersion {
    return this._entityVersion;
  }

  public get items(): T[] {
    return [...this._items];
  }
}