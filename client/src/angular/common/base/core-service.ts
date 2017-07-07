import { Headers, Http, RequestOptions, Response } from '@angular/http';

import 'rxjs/add/observable/throw';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/do';
import 'rxjs/add/operator/map';
import { Observable } from 'rxjs/Observable';

// -------------------------------------- logging --------------------------------------------
// tslint:disable-next-line:no-unused-variable
import { getLogger, ILogger, levels, using, XLog } from '@fluxgate/platform';
// -------------------------------------- logging --------------------------------------------


import { FindResult, IStatusQuery, QueryResult, ServiceConstants, StatusFilter } from '@fluxgate/common';
import { Assert, Core, Funktion, IToString } from '@fluxgate/core';

import { AppConfigService } from '../../services/app-config.service';
import { MetadataService } from '../../services/metadata.service';
import { ServiceBase } from './service-base';


/**
 * Abstrakte Basisklasse für alle REST-Services, die noch nicht auf Entities arbeiten,
 * die einen Primary Key haben (kein Interface @see{IEntity})
 *
 * @export
 * @abstract
 * @class CoreService
 * @template T
 */
export abstract class CoreService<T, TId extends IToString> extends ServiceBase<T, TId> {
  protected static logger = getLogger(CoreService);

  public static HEADERS = new Headers({ 'Content-Type': 'application/json' });   // ... Set content type to JSON
  public static OPTIONS = new RequestOptions({ headers: CoreService.HEADERS });           // Create a request option


  protected constructor(model: Funktion, metadataService: MetadataService,
    http: Http, configService: AppConfigService, topic?: string) {
    super(model, metadataService, http, configService, topic);
  }


  /**
   * Find all entities of type T.
   *
   * @returns {Observable<FindResult<T>>}
   *
   * @memberOf Service
   */
  public find(filter?: StatusFilter): Observable<FindResult<T>> {
    return using(new XLog(CoreService.logger, levels.INFO, 'find',
      `[${this.getModelClassName()}]: filter = ${Core.stringify(filter)}`), (log) => {

        const serializedFilter = this.serialize(filter);

        return this.http.post(`${this.getUrl()}/${ServiceConstants.FIND}`, serializedFilter, CoreService.OPTIONS)
          .map((response: Response) => this.deserialize(response.json()))
          .do((result: FindResult<T>) => {
            if (log.isInfoEnabled()) {
              log.log(`found [${this.getModelClassName()}]: -> ${result.items.length} item(s)`);
            }
          })
          .catch(this.handleError);
      });
  }


  /**
   * Finds all entities for the given query @param{query}
   *
   * @param {IQuery} query
   * @returns {Observable<QueryResult<T>>}
   *
   * @memberOf Service
   */
  public query(query: IStatusQuery): Observable<QueryResult<T>> {
    Assert.notNull(query, 'query');
    return using(new XLog(CoreService.logger, levels.INFO, 'query', `[${this.getModelClassName()}]`), (log) => {

      if (log.isDebugEnabled()) {
        log.debug(`query = ${Core.stringify(query)}`);
      }

      const serializedQuery = this.serialize(query);

      return this.http.post(`${this.getUrl()}/${ServiceConstants.QUERY}`, serializedQuery, CoreService.OPTIONS)
        .map((response: Response) => this.deserialize(response.json()))
        .do((result: QueryResult<T>) => {
          if (log.isInfoEnabled()) {
            log.log(`queried [${this.getModelClassName()}]: -> ${result.items.length} item(s)`);

            if (log.isDebugEnabled()) {
              log.debug(`query result: ${Core.stringify(result)}`);
            }
          }
        })
        .catch(this.handleError);
    });
  }
}