import { Observable } from 'rxjs';

import { ICurrentItemServiceState } from '../state/current-item-service-state.interface';
import { IServiceRequests } from './service-requests.interface';

/**
 * abstrakte Basisklasse für ServiceRequests, die ein "currentItem" unterstützen
 *
 * @export
 * @interface ICurrentItemServiceRequests
 * @extends {ServiceRequests}
 * @template T
 */
export interface ICurrentItemServiceRequests<T> extends IServiceRequests {

  /**
   * Setzt das aktuelle Item.
   *
   * @param {T} item
   *
   * @memberOf ServiceRequests
   */
  setCurrent(item: T): Observable<T>;

  getCurrentItemState(storeId: string): ICurrentItemServiceState<T>;

}