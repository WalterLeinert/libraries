import { Observable } from 'rxjs/Observable';

import { IQuery, IToString } from '@fluxgate/core';

import { IEntity } from '../../model/entity.interface';
import { IServiceRequests } from './service-requests.interface';


/**
 * Interface für CRUD-Operationen über ServiceRequests und Rest-API.
 *
 * @export
 * @interface ICrudServiceRequests
 * @extends {IServiceRequests}
 * @template T - Entity-Typ
 * @template TId - Typ der Entity-Id
 */
export interface IReadonlyServiceRequests<T, TId extends IToString> extends IServiceRequests {

  /**
   * Führt die query-Methode async aus und führt ein dispatch des zugehörigen Kommandos durch.
   *
   * @param {IQuery} query
   * @memberOf ICrudServiceRequests
   */
  query(query: IQuery): Observable<T[]>;

  /**
   * Führt die find-Methode async aus und führt ein dispatch des zugehörigen Kommandos durch.
   * @param {boolean} useCache - falls true, werden nur die Daten aus dem State übernommen; sonst Servercall
   *
   * @memberOf ICrudServiceRequests
   */
  find(): Observable<T[]>;


  /**
   * Führt die findById-Methode async aus und führt ein dispatch des zugehörigen Kommandos durch.
   *
   * @param {TId} id
   *
   * @memberOf ICrudServiceRequests
   */
  findById<T extends IEntity<TId>>(id: TId): Observable<T>;


  /**
   * Liefert die Id der Entity @param{item}
   *
   * @param {T} item
   * @returns {TId}
   *
   * @memberOf ICrudServiceRequests
   */
  getEntityId(item: T): TId;

  /**
   * Liefert den Namen der zugehörigen Modelklasse der Entity (z.B. User)
   *
   * @returns {string}
   *
   * @memberOf ICrudServiceRequests
   */
  getModelClassName(): string;
}