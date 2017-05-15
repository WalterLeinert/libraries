import { Observable } from 'rxjs/Observable';

import { IQuery } from '@fluxgate/core';

import { CreateResult } from './create-result';
import { DeleteResult } from './delete-result';
import { FindByIdResult } from './find-by-id-result';
import { FindResult } from './find-result';
import { QueryResult } from './query-result';
import { UpdateResult } from './update-result';


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
   * @returns {Observable<CreateResult<T>>}
   *
   */
  create(item: T): Observable<CreateResult<T>>;

  /**
   * Queries all entities of type T with given @param{query}.
   *
   * @param {IQuery} query
   * @returns {Observable<QueryResult<T>>}
   *
   */
  query(query: IQuery): Observable<QueryResult<T>>;

  /**
   * Find all entities of type T.
   *
   * @returns {Observable<FindResult<T>>}
   *
   */
  find(): Observable<FindResult<T>>;

  /**
   * Find the entity with the given id.
   *
   * @param {TId} id -- entity id.
   * @returns {Observable<FindByIdResult<T, TId>>}
   *
   */
  findById(id: TId): Observable<FindByIdResult<T, TId>>;

  /**
   * Update the entity {item} with the given id.
   *
   * @param {T} item
   * @returns {Observable<UpdateResult<T>>}
   *
   */
  update(item: T): Observable<UpdateResult<T>>;


  /**
   * Delete the entity with the given id.
   *
   * @param {TId} id
   * @returns {Observable<DeleteResult<TId>>}
   *
   */
  delete(id: TId): Observable<DeleteResult<TId>>;

}