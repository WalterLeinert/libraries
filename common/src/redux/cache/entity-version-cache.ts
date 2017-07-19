// -------------------------------------- logging --------------------------------------------
// tslint:disable-next-line:no-unused-variable
import { getLogger, ILogger, levels, using, XLog } from '@fluxgate/platform';
// -------------------------------------- logging --------------------------------------------

import { Assert, Core, Dictionary } from '@fluxgate/core';

export class EntityVersionCache {
  protected static readonly logger = getLogger(EntityVersionCache);

  public static instance = new EntityVersionCache();

  private entityDict: Dictionary<string, EntityVersionCacheEntry<any>> =
  new Dictionary<string, EntityVersionCacheEntry<any>>();

  public set<T>(entity: string, cacheEntry: EntityVersionCacheEntry<T>) {
    using(new XLog(EntityVersionCache.logger, levels.INFO, 'set'), (log) => {
      Assert.notNullOrEmpty(entity);
      Assert.notNull(cacheEntry);

      if (log.isDebugEnabled()) {
        log.debug(`entity = ${entity}: ${Core.stringify(cacheEntry)}`);
      }

      this.entityDict.set(entity, cacheEntry);
    });
  }

  public get<T>(entity: string): EntityVersionCacheEntry<T> {
    return using(new XLog(EntityVersionCache.logger, levels.INFO, 'get'), (log) => {
      Assert.notNullOrEmpty(entity);

      const cacheEntry = this.entityDict.get(entity);

      if (log.isDebugEnabled()) {
        log.debug(`entity = ${entity}: ${Core.stringify(cacheEntry)}`);
      }

      return cacheEntry;
    });
  }


  /**
   * Liefert die Keys aller CacheEntries, deren Key im Dictionary mit @param{entity} beginnt.
   */
  public getKeysStartingWith<T>(entity: string): string[] {
    return using(new XLog(EntityVersionCache.logger, levels.INFO, 'getStartingWith'), (log) => {
      Assert.notNullOrEmpty(entity);

      const keys = this.entityDict.keys.filter((item) => item.startsWith(entity));
      return keys;
    });
  }


  public reset() {
    using(new XLog(EntityVersionCache.logger, levels.INFO, 'reset'), (log) => {
      this.entityDict.clear();
    });
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

  public toString(): string {
    return `{ version: ${this._version}, items.length: ${this.items.length}}`;
  }
}