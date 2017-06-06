import { Observable } from 'rxjs/Observable';

import { IToString } from '@fluxgate/core';

import { IEntity } from '../../model/entity.interface';
import { ICrudServiceState } from '../state/crud-service-state.interface';
import { IReadonlyServiceRequests } from './readonly-service-requests.interface';


/**
 * Interface für CRUD-Operationen über ServiceRequests und Rest-API.
 *
 * @export
 * @interface ICrudServiceRequests
 * @extends {IServiceRequests}
 * @template T - Entity-Typ
 * @template TId - Typ der Entity-Id
 */
export interface ICrudServiceRequests<T extends IEntity<TId>, TId extends IToString>
  extends IReadonlyServiceRequests<T, TId> {

  /**
   * Führt die update-Methode async aus und führt ein dispatch des zugehörigen Kommandos durch.
   *
   * @param {T} item
   *
   * @memberOf ICrudServiceRequests
   */
  create(item: T): Observable<T>;

  /**
   * Führt die update-Methode async aus und führt ein dispatch des zugehörigen Kommandos durch.
   *
   * @param {T} item
   *
   * @memberOf ICrudServiceRequests
   */
  update(item: T): Observable<T>;


  /**
   * Führt die delete-Methodes async aus und führt ein dispatch des zugehörigen Kommandos durch.
   *
   * @param {TId} id
   *
   * @memberOf ICrudServiceRequests
   */
  deleteById(id: TId): Observable<TId>;

  /**
   * Führt die delete-Methodes async aus und führt ein dispatch des zugehörigen Kommandos durch.
   *
   * @param {T} item
   *
   * @memberOf ICrudServiceRequests
   */
  delete(item: T): Observable<TId>;


  /**
   * Liefert den Status für die @param{storeId}
   *
   * @param {string} storeId
   * @returns {ICrudServiceState<T, TId>}
   *
   * @memberOf ICrudServiceRequests
   */
  getCrudState(storeId: string): ICrudServiceState<T, TId>;
}