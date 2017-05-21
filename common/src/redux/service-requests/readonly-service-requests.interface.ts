import { Observable } from 'rxjs/Observable';

import { IToString } from '@fluxgate/core';

import { IEntity } from '../../model/entity.interface';
import { ICoreServiceRequests } from './core-service-requests.interface';


/**
 * Interface für CRUD-Operationen über ServiceRequests und Rest-API.
 *
 * @export
 * @interface ICrudServiceRequests
 * @extends {IServiceRequests}
 * @template T - Entity-Typ
 * @template TId - Typ der Entity-Id
 */
export interface IReadonlyServiceRequests<T extends IEntity<TId>, TId extends IToString>
  extends ICoreServiceRequests<T> {


  /**
   * Führt die findById-Methode async aus und führt ein dispatch des zugehörigen Kommandos durch.
   *
   * @param {TId} id
   *
   * @memberOf ICrudServiceRequests
   */
  findById<T>(id: TId): Observable<T>;

  /**
   * Liefert die Id der Entity @param{item}
   *
   * @param {T} item
   * @returns {TId}
   *
   * @memberOf ICrudServiceRequests
   */
  getEntityId(item: T): TId;
}