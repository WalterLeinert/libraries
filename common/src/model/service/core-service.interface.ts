import { Observable } from 'rxjs';

import { FindResult } from './find-result';
import { QueryResult } from './query-result';
import { IServiceBase } from './service-base.interface';
import { StatusFilter } from './status-filter';
import { IStatusQuery } from './status-query';

/**
 * Interface für alle Services, die Entities ohne primary key (Id) liefern
 */
export interface ICoreService<T> extends IServiceBase<T, any> {

  /**
   * Liefert alle Entities vom Typ T für die Query @param{query}
   * Über @param{filter} kann bzgl. des Entitystatus gefiltert werden (falls vorhanden)
   *
   * @param {IStatusQuery} query
   * @param {StatusFilter} [filter]
   * @returns {Observable<QueryResult<T>>}
   *
   */
  query(query: IStatusQuery): Observable<QueryResult<T>>;

  /**
   * Liefert alle Entities vom Typ T.
   * Über @param{filter} kann bzgl. des Entitystatus gefiltert werden (falls vorhanden)
   *
   * @param {StatusFilter} [filter]
   * @returns {Observable<FindResult<T>>}
   *
   * @memberof ICoreService
   */
  find(filter?: StatusFilter): Observable<FindResult<T>>;

}