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


import {
  FindByIdResult, FindResult, IEntity,
  QueryResult, TableMetadata
} from '@fluxgate/common';
import { Assert, Funktion, IQuery, IToString } from '@fluxgate/core';

import { ConfigService } from '../../services/config.service';
import { MetadataService } from '../../services/metadata.service';
import { ServiceBase } from './serviceBase';


/**
 * Abstract base class for common readonly rest-api service calls
 *
 * @export
 * @abstract
 * @class ReadonlyService
 * @template T
 */
export abstract class ReadonlyService<T, TId extends IToString> extends ServiceBase {
  protected static logger = getLogger(ReadonlyService);

  private _tableMetadata: TableMetadata;


  protected constructor(model: Funktion, private metadataService: MetadataService,
    http: Http, configService: ConfigService, private topic?: string) {
    super(http, configService.config.url,
      topic === undefined ? metadataService.findTableMetadata(model).options.name : topic);

    Assert.notNull(model, 'model');

    // Metadaten zur Entity ermitteln
    this._tableMetadata = this.metadataService.findTableMetadata(model);
    Assert.notNull(this._tableMetadata);
  }


  /**
   * Find all entities of type T.
   *
   * @returns {Observable<FindResult<T>>}
   *
   * @memberOf Service
   */
  public find(): Observable<FindResult<T>> {
    return using(new XLog(ReadonlyService.logger, levels.INFO, 'find', `[${this.getModelClassName()}]`), (log) => {

      return this.http.get(this.getUrl())
        .map((response: Response) => this.deserialize(response.json()))
        .do((result: FindResult<T>) => {
          if (log.isInfoEnabled()) {
            log.log(`Service.find [${this.getModelClassName()}]: -> ${result.items.length} item(s)`);
          }
        })
        .catch(this.handleError);
    });
  }


  /**
   * Find the entity with the given id.
   *
   * @param {TId} id -- entity id.
   * @returns {Observable<FindByIdResult<T, TId>>}
   *
   * @memberOf Service
   */
  public findById<T extends IEntity<TId>>(id: TId): Observable<FindByIdResult<T, TId>> {
    Assert.notNull(id, 'id');
    return using(new XLog(ReadonlyService.logger, levels.INFO, 'findById', `[${this.getModelClassName()}]`), (log) => {

      return this.http.get(`${this.getUrl()}/${id}`)
        .map((response: Response) => this.deserialize(response.json()))
        .do((result: FindByIdResult<T, TId>) => {
          if (log.isInfoEnabled()) {
            log.log(`Service.findById [${this.getModelClassName()}]: id = ${id} -> ${JSON.stringify(result)}`);
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
  public query(query: IQuery): Observable<QueryResult<T>> {
    Assert.notNull(query, 'query');
    return using(new XLog(ReadonlyService.logger, levels.INFO, 'query', `[${this.getModelClassName()}]`), (log) => {

      const headers = new Headers({ 'Content-Type': 'application/json' }); // ... Set content type to JSON
      const options = new RequestOptions({ headers: headers });           // Create a request option


      const serializedQuery = this.serialize(query);

      return this.http.post(`${this.getUrl()}/query`, serializedQuery, options)
        .map((response: Response) => this.deserialize(response.json()))
        .do((result: QueryResult<T>) => {
          if (log.isInfoEnabled()) {
            log.log(`result: ${result.items.length} item(s)`);

            if (log.isDebugEnabled()) {
              log.debug(`query = ${JSON.stringify(query)} -> ${JSON.stringify(result)}`);
            }
          }
        })
        .catch(this.handleError);
    });
  }


  /**
   * Liefert den Klassennamen der zugehörigen Modellklasse (Entity).
   *
   * @type {string}
   */
  public getModelClassName(): string {
    return this._tableMetadata.className;
  }

  public getTableName(): string {
    return this._tableMetadata.tableName;
  }


  /**
   * Liefert die zugehörige @see{TableMetadata}
   *
   * @readonly
   * @protected
   * @type {TableMetadata}
   * @memberOf Service
   */
  protected get tableMetadata(): TableMetadata {
    return this._tableMetadata;
  }

}