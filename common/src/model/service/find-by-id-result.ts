import { IToString } from '@fluxgate/core';

import { ServiceResult } from './service-result';

/**
 * Hilfsklasse für das Ergebnis des findById-Calls
 *
 * @export
 * @class FindByIdResult
 * @extends {ServiceResultBase}
 * @template TId
 */
export class FindByIdResult<T, TId extends IToString> extends ServiceResult {

  constructor(private _item: T, entityVersion: number) {
    super(entityVersion);
  }

  public get item(): T {
    return this._item;
  }
}