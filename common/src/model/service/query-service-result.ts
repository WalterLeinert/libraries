import { ServiceResultBase } from './service-result-base';

/**
 * Hilfsklasse für das Ergebnis des query-Calls
 *
 * @export
 * @class QueryServiceResult
 * @extends {ServiceResultBase}
 * @template TId
 */
export class QueryServiceResult<T> extends ServiceResultBase {

  constructor(private _items: T[], entityVersion: number) {
    super(entityVersion);
  }

  public get items(): T[] {
    return this._items;
  }
}