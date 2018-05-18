import { Observable } from 'rxjs';

import { StatusFilter } from '../../model/service/status-filter';
import { IStatusQuery } from '../../model/service/status-query';
import { IServiceRequests } from './service-requests.interface';

/**
 * Interface für alle ServiceRequests. Die Servicemethoden liefern Entities, die keine
 * Id (keinen primary key) haben müssen.
 *
 * @export
 * @interface ICoreServiceRequests
 * @extends {IServiceRequests}
 * @template T - Entity-Typ
 */
export interface ICoreServiceRequests<T> extends IServiceRequests {

  /**
   * Führt die query-Methode async aus und führt ein dispatch des zugehörigen Kommandos durch.
   *
   * @param {IQuery} query
   * @memberOf ICrudServiceRequests
   */
  query(query: IStatusQuery): Observable<T[]>;

  /**
   * Führt die find-Methode async aus und führt ein dispatch des zugehörigen Kommandos durch.
   * @param {boolean} useCache - falls true, werden nur die Daten aus dem State übernommen; sonst Servercall
   *
   * @memberOf ICrudServiceRequests
   */
  find(filter?: StatusFilter): Observable<T[]>;

  /**
   * Liefert den Namen der zugehörigen Modelklasse der Entity (z.B. User)
   *
   * @returns {string}
   *
   * @memberOf ICrudServiceRequests
   */
  getModelClassName(): string;
}