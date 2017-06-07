import { Http, Response } from '@angular/http';

import 'rxjs/add/observable/throw';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/do';
import 'rxjs/add/operator/map';
import { Observable } from 'rxjs/Observable';

// -------------------------------------- logging --------------------------------------------
// tslint:disable-next-line:no-unused-variable
import { getLogger, ILogger, levels, using, XLog } from '@fluxgate/platform';
// -------------------------------------- logging --------------------------------------------


import {
  CreateResult, DeleteResult, IEntity, ServiceConstants, UpdateResult
} from '@fluxgate/common';

import { Assert, Funktion, IToString } from '@fluxgate/core';

import { ConfigService } from '../../services/config.service';
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
    http: Http, configService: ConfigService, topic?: string) {
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

      return this.http.post(`${this.getUrl()}/${ServiceConstants.CREATE}`, this.serialize(item))
        .map((response: Response) => this.deserialize(response.json()))
        .do((result: CreateResult<T, TId>) => {
          if (log.isInfoEnabled()) {
            log.log(`Service.create: ${JSON.stringify(result)}`);
          }
        })
        .catch(this.handleError);
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
    return using(new XLog(Service.logger, levels.INFO, 'update', `[${this.getModelClassName()}]`), (log) => {

      return this.http.put(`${this.getUrl()}//${ServiceConstants.UPDATE}`, this.serialize(item))
        .map((response: Response) => this.deserialize(response.json()))
        .do((result: UpdateResult<T, TId>) => {
          if (log.isInfoEnabled()) {
            log.log(`Service.update [${this.getModelClassName()}]: ${JSON.stringify(result)}`);
          }
        })
        .catch(this.handleError);
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
          .map((response: Response) => this.deserialize(response.json()))
          .do((result: DeleteResult<TId>) => {
            if (log.isInfoEnabled()) {
              log.log(`Service.delete [${this.getModelClassName()}]: ${JSON.stringify(result)}`);
            }
          })
          .catch(this.handleError);
      });
  }


}