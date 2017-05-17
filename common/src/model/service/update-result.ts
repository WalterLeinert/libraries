import { Serializable, StringUtil } from '@fluxgate/core';

import { IEntity } from '../entity.interface';
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
export class UpdateResult<T extends IEntity<TId>, TId> extends ServiceResult {

  constructor(private _item: T, entityVersion: number) {
    super(entityVersion);
  }

  public get item(): T {
    return this._item;
  }

  // public toString(): string {
  //   return `{ UpdateResult: ${super.toString()}, item.id: ${this._item.id} }`;
  // }

  public toString(): string {
    return StringUtil.enclose(this, `${super.toString()}, item.id: ${this._item.id}`);
  }
}