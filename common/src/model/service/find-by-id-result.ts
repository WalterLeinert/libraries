import { IToString, Serializable } from '@fluxgate/core';

import { ServiceResult } from './service-result';

/**
 * Hilfsklasse für das Ergebnis des findById-Calls
 *
 * @export
 * @class FindByIdResult
 * @extends {ServiceResult}
 * @template TId
 */
@Serializable()
export class FindByIdResult<T, TId extends IToString> extends ServiceResult {

  constructor(private _item: T, entityVersion: number) {
    super(entityVersion);
  }

  public get item(): T {
    return this._item;
  }
}