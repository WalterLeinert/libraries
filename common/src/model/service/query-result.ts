import { Serializable, StringUtil } from '@fluxgate/core';

import { ServiceResult } from './service-result';

/**
 * Hilfsklasse für das Ergebnis des query-Calls
 *
 * @export
 * @class QueryResult
 * @extends {ServiceResult}
 * @template TId
 */
@Serializable()
export class QueryResult<T> extends ServiceResult {

  constructor(private _items: T[], entityVersion: number) {
    super(entityVersion);
  }

  public get items(): T[] {
    return this._items;
  }

  // public toString(): string {
  //   return `${super.toString()}, items.lengh: ${this._items.length}`;
  // }

  public toString(): string {
    return `${StringUtil.enclose(this, super.toString(),
      StringUtil.format(`items.length: ${this.items.length}`))}`;
  }
}