import { IToString } from '@fluxgate/core';

import { ServiceResultBase } from './service-result-base';

/**
 * Hilfsklasse für das Ergebnis des delete-Calls
 *
 * @export
 * @class DeleteServiceResult
 * @extends {ServiceResultBase}
 * @template TId
 */
export class DeleteServiceResult<TId extends IToString> extends ServiceResultBase {

  constructor(private _id: TId, entityVersion: number) {
    super(entityVersion);
  }

  public get id(): TId {
    return this._id;
  }
}