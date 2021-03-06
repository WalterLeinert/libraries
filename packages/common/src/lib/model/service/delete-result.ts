import { IToString, Serializable, StringUtil } from '@fluxgate/core';

import { ServiceResult } from './service-result';

/**
 * Hilfsklasse für das Ergebnis des delete-Calls
 *
 * @export
 * @class DeleteResult
 * @extends {ServiceResult}
 * @template TId
 */
@Serializable()
export class DeleteResult<TId extends IToString> extends ServiceResult {

  constructor(private _id: TId, entityVersion: number) {
    super(entityVersion);
  }

  public get id(): TId {
    return this._id;
  }

  public toString(): string {
    return StringUtil.enclose(this, `${super.toString()}, id: ${this._id}`);
  }

}