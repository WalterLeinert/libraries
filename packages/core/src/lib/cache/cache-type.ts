export type CacheType =

  /**
   * LRU-Cache based on lru-cache (see https://www.npmjs.com/package/lru-cache)
   */
  'lru';

export class CacheTypes {
  public static LRU: CacheType = 'lru';
}