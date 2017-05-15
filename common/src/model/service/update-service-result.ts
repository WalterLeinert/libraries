import { ServiceResultBase } from './service-result-base';

/**
 * Hilfsklasse für das Ergebnis des update-Calls
 *
 * @export
 * @class UpdateServiceResult
 * @extends {ServiceResultBase}
 * @template TId
 */
export class UpdateServiceResult<T> extends ServiceResultBase {

  constructor(private _item: T, entityVersion: number) {
    super(entityVersion);
  }

  public get item(): T {
    return this._item;
  }
}