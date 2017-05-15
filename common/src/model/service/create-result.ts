import { Serializable } from '@fluxgate/core';

import { ServiceResult } from './service-result';

/**
 * Hilfsklasse für das Ergebnis des create-Calls
 *
 * @export
 * @class CreateResult
 * @extends {ServiceResult}
 * @template TId
 */
@Serializable()
export class CreateResult<T> extends ServiceResult {

  constructor(private _item: T, entityVersion: number) {
    super(entityVersion);
  }

  public get item(): T {
    return this._item;
  }
}