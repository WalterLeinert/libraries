import { IToString } from '@fluxgate/core';

import { ServiceResultBase } from './service-result-base';

/**
 * Hilfsklasse für das Ergebnis des findById-Calls
 *
 * @export
 * @class FindByIdServiceResult
 * @extends {ServiceResultBase}
 * @template TId
 */
export class FindByIdServiceResult<T, TId extends IToString> extends ServiceResultBase {

  constructor(private _item: T, entityVersion: number) {
    super(entityVersion);
  }

  public get item(): T {
    return this._item;
  }
}