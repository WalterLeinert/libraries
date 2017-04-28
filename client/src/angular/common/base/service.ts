import { Headers, Http, RequestOptions, Response } from '@angular/http';

import 'rxjs/add/observable/throw';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/do';
import 'rxjs/add/operator/map';
import { Observable } from 'rxjs/Observable';


// -------------------------- logging -------------------------------
// tslint:disable-next-line:no-unused-variable
import { getLogger, ILogger } from '@fluxgate/platform';
// -------------------------- logging -------------------------------


import { IQuery, IService, ServiceResult, TableMetadata } from '@fluxgate/common';
import { Assert, Funktion, InvalidOperationException, IToString } from '@fluxgate/core';


import { Serializer } from '../../../base/serializer';
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
  private serializer: Serializer<T>;


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

    this._tableMetadata.registerService(this.constructor);
    this.serializer = new Serializer<T>(this.tableMetadata);
  }



  /**
   * Create the entity {item} and return {Observable<T>}
   *
   * @param {T} item
   * @returns {Observable<T>}
   *
   * @memberOf Service
   */
  public create(item: T): Observable<T> {
    Assert.notNull(item, 'item');

    return this.http.post(this.getUrl(), this.serialize(item))
      .map((response: Response) => this.deserialize(response.json()))
      .do((data) => Service.logger.info(`Service.create: ${JSON.stringify(data)}`))
      .catch(this.handleError);
  }



  /**
   * Find all entities of type T and return {Observable<T[]>}.
   *
   * @returns {Observable<T[]>}
   *
   * @memberOf Service
   */
  public find(): Observable<T[]> {
    return this.http.get(this.getUrl())
      .map((response: Response) => this.deserializeArray(response.json()))
      .do((data) => Service.logger.info(`Service.find [${this.getModelClassName()}]: -> ${data.length} item(s)`))
      .catch(this.handleError);
  }


  /**
   * Find the entity with the given id and return {Observable<T>}
   *
   * @param {TId} id -- entity id.
   * @returns {Observable<T>}
   *
   * @memberOf Service
   */
  public findById(id: TId): Observable<T> {
    Assert.notNull(id, 'id');

    return this.http.get(`${this.getUrl()}/${id}`)
      .map((response: Response) => this.deserialize(response.json()))
      .do((data) => Service.logger.info(`Service.findById [${this.getModelClassName()}]: ` +
        `id = ${id} -> ${JSON.stringify(data)}`))
      .catch(this.handleError);
  }


  /**
   * Update the entity {item} with the given id and return {Observable<T>}
   *
   * @param {T} item
   * @returns {Observable<T>}
   *
   * @memberOf Service
   */
  public update(item: T): Observable<T> {
    Assert.notNull(item, 'item');

    return this.http.put(`${this.getUrl()}`, this.serialize(item))
      .map((response: Response) => this.deserialize(response.json()))
      .do((data) => Service.logger.info(`Service.update [${this.getModelClassName()}]: ${JSON.stringify(data)}`))
      .catch(this.handleError);
  }


  /**
   * Delete the entity with the given id and return {Observable<T>}
   *
   * @param {TId} id
   * @returns {Observable<ServiceResult<TId>>}
   *
   * @memberOf Service
   */
  public delete(id: TId): Observable<ServiceResult<TId>> {
    Assert.notNull(id, 'id');

    return this.http.delete(`${this.getUrl()}/${id}`)
      .map((response: Response) => response.json())
      .do((serviceResult) => Service.logger.info(`Service.delete [${this.getModelClassName()}]: ` +
        `${JSON.stringify(serviceResult)}`))
      .catch(this.handleError);
  }


  /**
   * Finds all entities for the given query @param{query}
   *
   * @param {IQuery} query
   * @returns {Observable<T[]>}
   *
   * @memberOf Service
   */
  public query(query: IQuery): Observable<T[]> {
    Assert.notNull(query, 'query');

    const headers = new Headers({ 'Content-Type': 'application/json' }); // ... Set content type to JSON
    const options = new RequestOptions({ headers: headers });           // Create a request option

    return this.http.post(`${this.getUrl()}/query`, query, options)
      .map((response: Response) => this.deserializeArray(response.json()))
      .do((data) => Service.logger.info(`Service.query [${this.getModelClassName()}]: ` +
        `query = ${JSON.stringify(query)} -> ${JSON.stringify(data)}`))
      .catch(this.handleError);
  }


  /**
   * Liefert den Klassennamen der zugehörigen Modellklasse (Entity).
   *
   * @type {string}
   */
  public getModelClassName(): string {
    return this._tableMetadata.className;
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
   * Serialisiert das @param{item} für die Übertragung zum Server über das REST-Api.
   *
   * TODO: ggf. die Serialisierung von speziellen Attributtypen (wie Date) implementieren
   *
   * @param {T} item - Entity-Instanz
   * @returns {any}
   */
  protected serialize(item: T): any {
    return this.serializer.serialize(item);
  }


  /**
   * Deserialisiert das Json-Objekt, welches über das REST-Api vom Server zum Client übertragen wurde
   *
   * @param {any} json - Json-Objekt vom Server
   * @returns {T}
   *
   * @memberOf Service
   */
  protected deserialize(json: any): T {
    return this.serializer.deserialize(json);
  }

  /**
   * Deserialisiert ein Array von Json-Objekten, welches über das REST-Api vom Server zum Client übertragen wurde
   *
   * @param {any} json - Array von Json-Objekten vom Server
   * @returns {T[]}
   */
  protected deserializeArray(jsonArray: any): T[] {
    return this.serializer.deserializeArray(jsonArray);
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