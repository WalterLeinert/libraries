import { ServiceResultBase } from './service-result-base';

/**
 * Hilfsklasse für das Ergebnis des create-Calls
 *
 * @export
 * @class CreateServiceResult
 * @extends {ServiceResultBase}
 * @template TId
 */
export class CreateServiceResult<T> extends ServiceResultBase {

  constructor(private _item: T, entityVersion: number) {
    super(entityVersion);
  }

  public get item(): T {
    return this._item;
  }
}