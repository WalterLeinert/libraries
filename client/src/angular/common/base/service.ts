import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';

// -------------------------------------- logging --------------------------------------------
// tslint:disable-next-line:no-unused-variable
import { getLogger, ILogger, levels, using, XLog } from '@fluxgate/platform';
// -------------------------------------- logging --------------------------------------------


import {
  CreateResult, DeleteResult, IEntity, ServiceConstants, UpdateResult
} from '@fluxgate/common';

import { Assert, Core, Funktion, IToString } from '@fluxgate/core';

import { AppConfigService } from '../../services/app-config.service';
import { MetadataService } from '../../services/metadata.service';

import { ReadonlyService } from './readonly-service';


/**
 * Abstrakte Basisklasse für alle REST-Services, die noch auf Entities arbeiten,
 * die einen Primary Key haben (Interface @see{IEntity}) und Änderungen auf Entities
 * durchführen (CRUD).
 *
 * @export
 * @abstract
 * @class Service
 * @template T
 */
export abstract class Service<T extends IEntity<TId>, TId extends IToString> extends ReadonlyService<T, TId> {
  protected static logger = getLogger(Service);


  /**
   * Creates an instance of Service.
   *
   * @param {Http} _http - Http client
   * @param {string} baseUrl - base url of request
   *
   * @memberOf Service
   */
  protected constructor(model: Funktion, metadataService: MetadataService,
    http: HttpClient, configService: AppConfigService, topic?: string) {
    super(model, metadataService, http, configService, topic);
  }


  /**
   * Create the entity {item}.
   *
   * @param {T} item
   * @returns {Observable<CreateResult<T>>}
   *
   * @memberOf Service
   */
  public create(item: T): Observable<CreateResult<T, TId>> {
    Assert.notNull(item, 'item');
    return using(new XLog(Service.logger, levels.INFO, 'create', `[${this.getModelClassName()}]`), (log) => {

      if (log.isDebugEnabled()) {
        log.debug(`item = ${Core.stringify(item)}`);
      }

      return this.http.post(`${this.getUrl()}/${ServiceConstants.CREATE}`, this.serialize(item))
        .pipe(
          map((response: Response) => this.deserialize(response.json())),
          tap((result: CreateResult<T, TId>) => {
            if (log.isInfoEnabled()) {
              log.log(`created ${Core.stringify(result)}`);
            }
          }),
          catchError<CreateResult<T, TId>, any>(this.handleError)
        );
    });
  }



  /**
   * Update the entity {item} with the given id.
   *
   * @param {T} item
   * @returns {Observable<UpdateResult<T>>}
   *
   * @memberOf Service
   */
  public update(item: T): Observable<UpdateResult<T, TId>> {
    Assert.notNull(item, 'item');
    return using(new XLog(Service.logger, levels.INFO, 'update',
      `[${this.getModelClassName()}]: id ${item.id}`), (log) => {

        if (log.isDebugEnabled()) {
          log.debug(`item = ${Core.stringify(item)}`);
        }

        return this.http.put(`${this.getUrl()}/${ServiceConstants.UPDATE}`, this.serialize(item))
          .pipe(
            map((response: Response) => this.deserialize(response.json())),
            tap((result: UpdateResult<T, TId>) => {
              if (log.isInfoEnabled()) {
                log.log(`updated [${this.getModelClassName()}]: ${Core.stringify(result)}`);
              }
            }),
            catchError<UpdateResult<T, TId>, any>(this.handleError)
          );
      });
  }


  /**
   * Delete the entity with the given id.
   *
   * @param {TId} id
   * @returns {Observable<DeleteResult<TId>>}
   *
   * @memberOf Service
   */
  public delete(id: TId): Observable<DeleteResult<TId>> {
    Assert.notNull(id, 'id');
    return using(new XLog(Service.logger, levels.INFO, 'delete', `[${this.getModelClassName()}]: id = ${id}`),
      (log) => {

        return this.http.delete(`${this.getUrl()}/${id}`)
          .pipe(
            map((response: Response) => this.deserialize(response.json())),
            tap((result: DeleteResult<TId>) => {
              if (log.isInfoEnabled()) {
                log.log(`deleted [${this.getModelClassName()}]: ${Core.stringify(result)}`);
              }
            }),
            catchError<DeleteResult<TId>, any>(this.handleError)
          );
      });
  }

}