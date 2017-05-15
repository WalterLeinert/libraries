import { ServiceResult } from './service-result';

/**
 * Hilfsklasse für das Ergebnis des update-Calls
 *
 * @export
 * @class UpdateResult
 * @extends {ServiceResultBase}
 * @template TId
 */
export class UpdateResult<T> extends ServiceResult {

  constructor(private _item: T, entityVersion: number) {
    super(entityVersion);
  }

  public get item(): T {
    return this._item;
  }
}