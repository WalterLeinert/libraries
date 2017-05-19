import { Serializable, StringUtil } from '@fluxgate/core';

import { IEntity } from '../entity.interface';
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
export class CreateResult<T extends IEntity<TId>, TId> extends ServiceResult {

  constructor(private _item: T, entityVersion: number) {
    super(entityVersion);
  }

  public get item(): T {
    return this._item;
  }

  public toString(): string {
    return StringUtil.enclose(this, `${super.toString()}, item.id: ${this._item.id}`);
  }

}