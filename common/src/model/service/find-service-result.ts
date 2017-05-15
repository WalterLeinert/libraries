import { ServiceResultBase } from './service-result-base';

/**
 * Hilfsklasse für das Ergebnis des find-Calls
 *
 * @export
 * @class FindServiceResult
 * @extends {ServiceResultBase}
 * @template TId
 */
export class FindServiceResult<T> extends ServiceResultBase {

  constructor(private _items: T[], entityVersion: number) {
    super(entityVersion);
  }

  public get items(): T[] {
    return this._items;
  }
}