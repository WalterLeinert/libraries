import * as LRU from 'lru-cache';

// -------------------------------------- logging --------------------------------------------
import { using } from '../base/disposable';
import { levels } from '../diagnostics/level';
// tslint:disable-next-line:no-unused-variable
import { ILogger } from '../diagnostics/logger.interface';
import { getLogger } from '../diagnostics/logging-core';
import { XLog } from '../diagnostics/xlog';
// -------------------------------------- logging --------------------------------------------


import { Clone } from '../base/clone';
import { Core } from '../diagnostics/core';
import { Types } from '../types/types';
import { Assert } from '../util/assert';

import { ICache } from './cache.interface';


export interface ILruCacheOptions {
  maxItems?: number;
  maxAgeMilliSeconds?: number;
}


/**
 * Implements a LRU-Cache by using lru-cache from npm.
 *
 * @export
 * @class LruCache
 * @implements {ICache<T, TId>}
 * @template T
 * @template TId
 */
export class LruCache<T, TKey> implements ICache<T, TKey> {
  protected static readonly logger = getLogger(LruCache);

  /**
   * default lru cache options (documentation from lru-cache)
   */
  private static readonly DEFAULT_OPTIONS: LRU.Options<any> = {

    /**
     * The maximum size of the cache, checked by applying the length function to all values in the cache.
     * Not setting this is kind of silly, since that's the whole purpose of this lib, but it defaults to Infinity.
     */
    max: 100,

    /**
     * Maximum age in ms.
     * Items are not pro-actively pruned out as they age, but if you try to get an item that is too old,
     * it'll drop it and return undefined instead of giving it to you
     */
    maxAge: 60 * 1000,

    /**
     * Function that is used to calculate the length of stored items.
     * If you're storing strings or buffers, then you probably want to do something like
     * function(n, key){return n.length}.
     * The default is function(){return 1}, which is fine if you want to store max like-sized things.
     * The item is passed as the first argument, and the key is passed as the second argumnet.
     */
    length: (value) => {
      return using(new XLog(LruCache.logger, levels.INFO, 'length'), (log) => {
        return 1;
      });
    },

    /**
     * Function that is called on items when they are dropped from the cache.
     * This can be handy if you want to close file descriptors or do other cleanup tasks when items
     * are no longer accessible. Called with key, value.
     * It's called before actually removing the item from the internal cache, so if you want to immediately
     * put it back in, you'll have to do that in a nextTick or setTimeout callback or it won't do anything.
     */
    dispose: (key: any, value: any) => {
      return using(new XLog(LruCache.logger, levels.INFO, 'dispose', `key = ${key}`), (log) => {
        log.log(`value = ${Core.stringify(value)}`);
      });
    },

    /**
     * By default, if you set a maxAge, it'll only actually pull stale items out of the cache when you get(key).
     * (That is, it's not pre-emptively doing a setTimeout or anything.) If you set stale:true,
     * it'll return the stale value before deleting it. If you don't set this, then it'll return undefined when
     * you try to get a stale entry, as if it had already been deleted.
     */
    stale: true
  };


  private _cache: LRU.Cache<T>;

  public constructor(options?: ILruCacheOptions) {
    using(new XLog(LruCache.logger, levels.INFO, 'ctor'), (log) => {

      const cacheOptions = Clone.clone(LruCache.DEFAULT_OPTIONS);

      if (options) {
        if (Types.isPresent(options.maxItems)) {
          cacheOptions.max = options.maxItems;
        }

        if (Types.isPresent(options.maxAgeMilliSeconds)) {
          cacheOptions.maxAge = options.maxAgeMilliSeconds;
        }
      } else {
        log.log(`no options given: taking defaults`);
      }

      log.log(`cacheOptions = ${Core.stringify(cacheOptions)}`);

      this._cache = LRU<T>(cacheOptions);
    });
  }


  public get(key: TKey): T {
    Assert.notNull(key);

    return using(new XLog(LruCache.logger, levels.INFO, 'get', `key = ${key}`), (log) => {
      const item = this._cache.get(key);
      if (log.isDebugEnabled()) {
        log.debug(`item = ${Core.stringify(item)}`);
      }

      return item;
    });
  }


  public set(key: TKey, item: T) {
    Assert.notNull(key);
    Assert.notNull(item);

    using(new XLog(LruCache.logger, levels.INFO, 'set', `key = ${key}`), (log) => {
      if (log.isDebugEnabled()) {
        log.debug(`item = ${Core.stringify(item)}`);
      }

      this._cache.set(key, item);
    });
  }


  public remove(key: TKey) {
    Assert.notNull(key);

    using(new XLog(LruCache.logger, levels.INFO, 'remove', `key = ${key}`), (log) => {
      this._cache.del(key);
    });
  }
}