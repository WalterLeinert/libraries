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
  CreateResult, DeleteResult, FindByIdResult, FindResult, IService,
  QueryResult, TableMetadata, UpdateResult
} from '@fluxgate/common';

import { Assert, Funktion, InvalidOperationException, IQuery, IToString } from '@fluxgate/core';

import { ConfigService } from '../../services/config.service';
import { MetadataService } from '../../services/metadata.service';
import { ServiceBase } from './serviceBase';


/**
 * Abstract base class for common rest-api service calls
 *
 * @export
 * @abstract
 * @class Service
 * @template T
 */
export abstract class Service<T, TId extends IToString> extends ServiceBase implements IService<T, TId> {
  protected static logger = getLogger(Service);

  private _tableMetadata: TableMetadata;


  /**
   * Creates an instance of Service.
   *
   * @param {Http} _http - Http client
   * @param {string} baseUrl - base url of request
   *
   * @memberOf Service
   */
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
   * Create the entity {item}.
   *
   * @param {T} item
   * @returns {Observable<CreateResult<T>>}
   *
   * @memberOf Service
   */
  public create(item: T): Observable<CreateResult<T>> {
    Assert.notNull(item, 'item');
    return using(new XLog(Service.logger, levels.INFO, 'create', `[${this.getModelClassName()}]`), (log) => {

      return this.http.post(this.getUrl(), this.serialize(item))
        .map((response: Response) => this.deserialize(response.json()))
        .do((result: CreateResult<T>) => {
          if (log.isInfoEnabled()) {
            log.log(`Service.create: ${JSON.stringify(result)}`);
          }
        })
        .catch(this.handleError);
    });
  }



  /**
   * Find all entities of type T.
   *
   * @returns {Observable<FindResult<T>>}
   *
   * @memberOf Service
   */
  public find(): Observable<FindResult<T>> {
    return using(new XLog(Service.logger, levels.INFO, 'find', `[${this.getModelClassName()}]`), (log) => {

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
  public findById(id: TId): Observable<FindByIdResult<T, TId>> {
    Assert.notNull(id, 'id');
    return using(new XLog(Service.logger, levels.INFO, 'findById', `[${this.getModelClassName()}]`), (log) => {

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
   * Update the entity {item} with the given id.
   *
   * @param {T} item
   * @returns {Observable<UpdateResult<T>>}
   *
   * @memberOf Service
   */
  public update(item: T): Observable<UpdateResult<T>> {
    Assert.notNull(item, 'item');
    return using(new XLog(Service.logger, levels.INFO, 'update', `[${this.getModelClassName()}]`), (log) => {

      return this.http.put(`${this.getUrl()}`, this.serialize(item))
        .map((response: Response) => this.deserialize(response.json()))
        .do((result: UpdateResult<T>) => {
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
          .map((response: Response) => response.json())
          .do((result: DeleteResult<TId>) => {
            if (log.isInfoEnabled()) {
              log.log(`Service.delete [${this.getModelClassName()}]: ${JSON.stringify(result)}`);
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
    return using(new XLog(Service.logger, levels.INFO, 'query', `[${this.getModelClassName()}]`), (log) => {

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
   * Liefert die Id der Entity @param{item} über die Metainformation, falls vorhanden.
   * Sonst wird ein Error geworfen.
   *
   * @type {any}
   * @memberOf Service
   */
  public getEntityId(item: T): TId {
    if (!this._tableMetadata.primaryKeyColumn) {
      throw new InvalidOperationException(`Table ${this._tableMetadata.options.name}: no primary key column`);
    }
    return item[this._tableMetadata.primaryKeyColumn.propertyName];
  }


  /**
   * Setzt die Id der Entity @param{item} über die Metainformation, falls vorhanden.
   * Sonst wird ein Error geworfen.
   *
   * @type {any}
   * @memberOf Service
   */
  public setEntityId(item: T, id: TId) {
    if (!this._tableMetadata.primaryKeyColumn) {
      throw new InvalidOperationException(`Table ${this._tableMetadata.options.name}: no primary key column`);
    }
    item[this._tableMetadata.primaryKeyColumn.propertyName] = id;
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