import { IToString } from '@fluxgate/core';

import { ServiceResult } from './service-result';

/**
 * Hilfsklasse für das Ergebnis des delete-Calls
 *
 * @export
 * @class DeleteResult
 * @extends {ServiceResult}
 * @template TId
 */
export class DeleteResult<TId extends IToString> extends ServiceResult {

  constructor(private _id: TId, entityVersion: number) {
    super(entityVersion);
  }

  public get id(): TId {
    return this._id;
  }
}