import { NotSupportedException } from '../exceptions/notSupportedException';
import { Types } from '../types/types';
import { CacheType, CacheTypes } from './cache-type';
import { ICache } from './cache.interface';
import { ILruCacheOptions, LruCache } from './lru-cache';


export interface ICacheFactory<TOption> {
  create<T, TKey>(options?: TOption): ICache<T, TKey>;
  createAll<T, TKey>(options?: TOption[]): Array<ICache<T, TKey>>;
}


export class CacheFactoryFactory {
  public static instance = new CacheFactoryFactory();

  public create(cacheType: CacheType): ICacheFactory<any> {
    switch (cacheType) {
      case CacheTypes.LRU:
        return new LruCacheFactory();

      default:
        throw new NotSupportedException(`unknown type: ${cacheType}`);
    }
  }

}


// tslint:disable-next-line:max-classes-per-file
export class LruCacheFactory implements ICacheFactory<ILruCacheOptions> {

  public create<T, TKey>(options?: ILruCacheOptions): ICache<T, TKey> {
    return new LruCache<T, TKey>(options);
  }

  public createAll<T, TKey>(options?: ILruCacheOptions[]): Array<ICache<T, TKey>> {
    const caches = [];
    if (Types.isPresent(options)) {
      options.forEach((option) => {
        caches.push(new LruCache(option));
      });
    }
    return caches;
  }

}