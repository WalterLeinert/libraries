import { Serializable } from '@fluxgate/core';

import { ServiceResult } from './service-result';

/**
 * Hilfsklasse für das Ergebnis des find-Calls
 *
 * @export
 * @class FindResult
 * @extends {ServiceResult}
 * @template TId
 */
@Serializable()
export class FindResult<T> extends ServiceResult {

  constructor(private _items: T[], entityVersion: number) {
    super(entityVersion);
  }

  public get items(): T[] {
    return this._items;
  }
}