/**
 * Interface for various cache implemetations
 *
 * @export
 * @interface ICache
 * @template T - type of cache items
 * @template TKey - key for the cache item
 */
export interface ICache<T, TKey> {

  /**
   * returns the cache item for the given @param{key}
   *
   * @param {TKey} key
   * @memberof ICache
   */
  get(key: TKey): T;

  /**
   * sets the cache item @param{item} for the given @param{key}
   *
   * @param {TKey} key
   * @param {T} item
   * @memberof ICache
   */
  set(key: TKey, item: T);

  /**
   * removes the cache item for the given @param{key}
   *
   * @param {TKey} key
   * @memberof ICache
   */
  remove(key: TKey);
}