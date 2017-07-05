// -------------------------------------- logging --------------------------------------------
// tslint:disable-next-line:no-unused-variable
import { getLogger, ILogger, levels, using, XLog } from '@fluxgate/platform';
// -------------------------------------- logging --------------------------------------------


import { Funktion } from '@fluxgate/core';

import { ICache } from './cache.interface';


/**
 * Manages multiple caches identified by a 'model' (string|function)
 *
 * @export
 * @class CacheManager
 * @template T - ache item type
 */
export class CacheManager<T> {
  protected static readonly logger = getLogger(CacheManager);

  private cacheMap = new Map<string, ICache<T, any>>();


  /**
   * Adds for the model @param{model} a new cache @param{cache}.
   *
   * @param {(string | Funktion)} model
   * @param {ICache<CacheItem, any>} cache
   * @memberof CacheManager
   */
  public add(model: string | Funktion, cache: ICache<T, any>) {
    using(new XLog(CacheManager.logger, levels.INFO, 'add'), (log) => {
      this.cacheMap.set(this.createKey(model), cache);
    });
  }


  /**
   * returns the cacheItem for the given @{model} and @{key}
   *
   * @template TId
   * @param {(string | Funktion)} model
   * @param {TId} id
   * @returns {CacheItem}
   * @memberof CacheManager
   */
  public getItem<TKey>(model: string | Funktion, key: TKey): T {
    return using(new XLog(CacheManager.logger, levels.INFO, 'getItem', `key = ${key}`), (log) => {
      const cache = this.cacheMap.get(this.createKey(model));
      const item = cache.get(key);

      if (log.isDebugEnabled()) {
        log.debug(`item = ${JSON.stringify(item)}`);
      }

      return item;
    });
  }


  /**
   * sets the cacheItem @param{item} for the given @{model} and @{key}
   *
   * @template TKey
   * @param {(string | Funktion)} model
   * @param {TKey} key
   * @param {CacheItem} item
   * @memberof CacheManager
   */
  public setItem<TKey>(model: string | Funktion, key: TKey, item: T) {
    using(new XLog(CacheManager.logger, levels.INFO, 'setItem', `key = ${key}`), (log) => {
      const cache = this.cacheMap.get(this.createKey(model));

      if (log.isDebugEnabled()) {
        log.debug(`item = ${JSON.stringify(item)}`);
      }
      cache.set(key, item);
    });
  }


  public removeItem<TKey>(model: string | Funktion, key: TKey) {
    using(new XLog(CacheManager.logger, levels.INFO, 'removeItem', `key = ${key}`), (log) => {
      const cache = this.cacheMap.get(this.createKey(model));
      cache.remove(key);
    });
  }

  private createKey(model: string | Funktion): string {
    return typeof model === 'string' ? model : model.name;
  }
}