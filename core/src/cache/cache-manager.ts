// -------------------------------------- logging --------------------------------------------
import { using } from '../base/disposable';
import { levels } from '../diagnostics/level';
// tslint:disable-next-line:no-unused-variable
import { ILogger } from '../diagnostics/logger.interface';
import { getLogger } from '../diagnostics/logging-core';
import { XLog } from '../diagnostics/xlog';
// -------------------------------------- logging --------------------------------------------

import { Core } from '../diagnostics/core';
import { Funktion } from '../base/objectType';
import { Types } from '../types/types';
import { Assert } from '../util/assert';
import { CacheFactoryFactory } from './cache-factory';
import { ICacheManagerConfiguration } from './cache-manager-configuration.interface';
import { ICache } from './cache.interface';




/**
 * Manages multiple caches identified by a 'model' (string|function)
 *
 * @export
 * @class CacheManager
 */
export class CacheManager {
  protected static readonly logger = getLogger(CacheManager);

  private cacheMap = new Map<string, ICache<any, any>>();

  public constructor(managerConfiguration: ICacheManagerConfiguration) {
    Assert.notNull(managerConfiguration);

    let cacheType = managerConfiguration.cacheType;

    managerConfiguration.configurations.forEach((configuration) => {
      cacheType = Types.isNullOrEmpty(configuration.cacheType) ? cacheType : configuration.cacheType;

      const cacheFactory = CacheFactoryFactory.instance.create(cacheType);
      const cache = cacheFactory.create(configuration.options);
      this.addCache(configuration.model, cache);
    });
  }


  /**
   * Adds for the model @param{model} a new cache @param{cache}.
   *
   * @param {(string | Funktion)} model
   * @param {ICache<CacheItem, any>} cache
   * @memberof CacheManager
   */
  public addCache<T>(model: string | Funktion, cache: ICache<T, any>) {
    using(new XLog(CacheManager.logger, levels.INFO, 'add'), (log) => {
      this.cacheMap.set(this.createKey(model), cache);
    });
  }

  /**
   * returns true, if a cache is registered for the given @param{model}.
   *
   * @param {(string | Funktion)} model
   * @returns {boolean}
   * @memberof CacheManager
   */
  public containsCache(model: string | Funktion): boolean {
    return this.cacheMap.has(this.createKey(model));
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
  public getItem<T, TKey>(model: string | Funktion, key: TKey): T {
    return using(new XLog(CacheManager.logger, levels.INFO, 'getItem', `key = ${key}`), (log) => {
      const cache = this.cacheMap.get(this.createKey(model));
      const item = cache.get(key);

      if (log.isDebugEnabled()) {
        log.debug(`item = ${Core.stringify(item)}`);
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
  public setItem<T, TKey>(model: string | Funktion, key: TKey, item: T) {
    using(new XLog(CacheManager.logger, levels.INFO, 'setItem', `key = ${key}`), (log) => {
      const cache = this.cacheMap.get(this.createKey(model));

      if (log.isDebugEnabled()) {
        log.debug(`item = ${Core.stringify(item)}`);
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

  public get count(): number {
    return this.cacheMap.size;
  }

  private createKey(model: string | Funktion): string {
    return typeof model === 'string' ? model : model.name;
  }
}