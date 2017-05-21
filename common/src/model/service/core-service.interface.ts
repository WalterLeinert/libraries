import { Observable } from 'rxjs/Observable';

import { IQuery } from '@fluxgate/core';
import { FindResult } from './find-result';
import { QueryResult } from './query-result';
import { IServiceBase } from './service-base.interface';

/**
 * Interface für alle Services, die Entities ohne primary key (Id) liefern
 */
export interface ICoreService<T> extends IServiceBase<T, any> {

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

}