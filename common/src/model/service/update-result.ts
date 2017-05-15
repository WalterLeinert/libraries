import { Serializable } from '@fluxgate/core';

import { ServiceResult } from './service-result';

/**
 * Hilfsklasse für das Ergebnis des update-Calls
 *
 * @export
 * @class UpdateResult
 * @extends {ServiceResult}
 * @template TId
 */
@Serializable()
export class UpdateResult<T> extends ServiceResult {

  constructor(private _item: T, entityVersion: number) {
    super(entityVersion);
  }

  public get item(): T {
    return this._item;
  }
}