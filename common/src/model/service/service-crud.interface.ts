import { Observable } from 'rxjs/Observable';

import { IQuery } from '@fluxgate/core';

import { CreateServiceResult } from './create-service-result';
import { DeleteServiceResult } from './delete-service-result';
import { FindByIdServiceResult } from './find-by-id-service-result';
import { FindServiceResult } from './find-service-result';
import { QueryServiceResult } from './query-service-result';
import { UpdateServiceResult } from './update-service-result';


/**
 * Interface mit CRUD-Funktionen
 *
 * Hier sind keine generischen Typen verwendet, damit man das Interface auch
 * generisch in Zusammenhang mit Reflection un Metadaten verwenden kann.
 */
export interface IServiceCrud<T, TId> {

  /**
   * Create the entity {item}.
   *
   * @param {T} item
   * @returns {Observable<CreateServiceResult<T>>}
   *
   */
  create(item: T): Observable<CreateServiceResult<T>>;

  /**
   * Queries all entities of type T with given @param{query}.
   *
   * @param {IQuery} query
   * @returns {Observable<QueryServiceResult<T>>}
   *
   */
  query(query: IQuery): Observable<QueryServiceResult<T>>;

  /**
   * Find all entities of type T.
   *
   * @returns {Observable<FindServiceResult<T>>}
   *
   */
  find(): Observable<FindServiceResult<T>>;

  /**
   * Find the entity with the given id.
   *
   * @param {TId} id -- entity id.
   * @returns {Observable<FindByIdServiceResult<T, TId>>}
   *
   */
  findById(id: TId): Observable<FindByIdServiceResult<T, TId>>;

  /**
   * Update the entity {item} with the given id.
   *
   * @param {T} item
   * @returns {Observable<UpdateServiceResult<T>>}
   *
   */
  update(item: T): Observable<UpdateServiceResult<T>>;


  /**
   * Delete the entity with the given id.
   *
   * @param {TId} id
   * @returns {Observable<DeleteServiceResult<TId>>}
   *
   */
  delete(id: TId): Observable<DeleteServiceResult<TId>>;

}