import { Observable } from 'rxjs/Observable';

import { IQuery, IToString } from '@fluxgate/core';

import { IEntity } from '../entity.interface';
import { FindByIdResult } from './find-by-id-result';
import { FindResult } from './find-result';
import { QueryResult } from './query-result';
import { IServiceBase } from './serviceBase.interface';

/**
 * Interface für alle readonly Services
 */
export interface IReadonlyService<T, TId extends IToString> extends IServiceBase<T, TId> {

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
  findById<T extends IEntity<TId>>(id: TId): Observable<FindByIdResult<T, TId>>;

}