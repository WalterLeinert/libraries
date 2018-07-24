import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';

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
 */
export abstract class CoreService<T, TId extends IToString> extends ServiceBase<T, TId> {
  protected static logger = getLogger(CoreService);

  public static JSON_HEADERS = new HttpHeaders({ 'Content-Type': 'application/json' });   // set content type to JSON
  public static JSON_OPTIONS = { headers: CoreService.JSON_HEADERS };                     // create a request option


  protected constructor(model: Funktion, metadataService: MetadataService,
    http: HttpClient, configService: AppConfigService, topic?: string) {
    super(model, metadataService, http, configService, topic);
  }


  /**
   * Find all entities of type T.
   */
  public find(filter?: StatusFilter): Observable<FindResult<T>> {
    return using(new XLog(CoreService.logger, levels.INFO, 'find',
      `[${this.getModelClassName()}]: filter = ${Core.stringify(filter)}`), (log) => {

        const serializedFilter = this.serialize(filter);

        return this.http.post(`${this.getUrl()}/${ServiceConstants.FIND}`, serializedFilter, CoreService.JSON_OPTIONS)
          .pipe(
            map((response: Response) => this.deserialize(response.json())),
            tap((result: FindResult<T>) => {
              if (log.isInfoEnabled()) {
                log.log(`found [${this.getModelClassName()}]: -> ${result.items.length} item(s)`);
              }
              return result;
            }),
            catchError<FindResult<T>, any>(this.handleError)
          );
      });
  }


  /**
   * Finds all entities for the given query @param{query}
   *
   * @param query
   * @returns
   */
  public query(query: IStatusQuery): Observable<QueryResult<T>> {
    Assert.notNull(query, 'query');
    return using(new XLog(CoreService.logger, levels.INFO, 'query', `[${this.getModelClassName()}]`), (log) => {

      if (log.isDebugEnabled()) {
        log.debug(`query = ${Core.stringify(query)}`);
      }

      const serializedQuery = this.serialize(query);

      return this.http.post(`${this.getUrl()}/${ServiceConstants.QUERY}`, serializedQuery, CoreService.JSON_OPTIONS)
        .pipe(
          map((response: Response) => this.deserialize(response.json())),
          tap((result: QueryResult<T>) => {
            if (log.isInfoEnabled()) {
              log.log(`queried [${this.getModelClassName()}]: -> ${result.items.length} item(s)`);

              if (log.isDebugEnabled()) {
                log.debug(`query result: ${Core.stringify(result)}`);
              }
            }
          }),
          catchError<QueryResult<T>, any>(this.handleError)
        );
    });
  }
}