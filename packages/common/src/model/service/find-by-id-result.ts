import { IToString, Serializable, StringUtil } from '@fluxgate/core';

import { IEntity } from '../entity.interface';
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
export class FindByIdResult<T extends IEntity<TId>, TId extends IToString> extends ServiceResult {

  constructor(private _item: T, entityVersion: number) {
    super(entityVersion);
  }

  public get item(): T {
    return this._item;
  }

  // public toString(): string {
  //   return `${super.toString()}, item.id: ${this._item.id}`;
  // }


  public toString(): string {
    return StringUtil.enclose(this, `${super.toString()}, item.id: ${this._item.id}`);
  }
}