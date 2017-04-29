import { Observable } from 'rxjs/Observable';

import { IToString } from '@fluxgate/core';
import { IEntity } from '../../model/entity.interface';
import { ICurrentItemServiceState } from '../state/current-item-service-state.interface';
import { IServiceRequests } from './service-requests.interface';

/**
 * abstrakte Basisklasse für ServiceRequests, die ein "currentItem" unterstützen
 *
 * @export
 * @interface ICurrentItemServiceRequests
 * @extends {ServiceRequests}
 * @template T
 * @template TId
 */
export interface ICurrentItemServiceRequests<T extends IEntity<TId>, TId extends IToString> extends IServiceRequests {

  /**
   * Setzt das aktuelle Item.
   *
   * @param {T} item
   *
   * @memberOf ServiceRequests
   */
  setCurrent(item: T): Observable<T>;

  getCurrentItemState(storeId: string): ICurrentItemServiceState<T, TId>;

}