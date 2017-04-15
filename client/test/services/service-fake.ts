import 'rxjs/add/observable/of';
import { Observable } from 'rxjs/Observable';


// -------------------------------------- logging --------------------------------------------
// tslint:disable-next-line:no-unused-variable
import { getLogger, ILogger, levels, using, XLog } from '@fluxgate/platform';
// -------------------------------------- logging --------------------------------------------

import {
  EntityGenerator, IFlxEntity, IQuery, IService, ServiceResult, Status, TableMetadata
} from '@fluxgate/common';
import { Assert, Funktion, InvalidOperationException, IToString, NotSupportedException } from '@fluxgate/core';

import { MetadataService } from '../../src/angular/services/metadata.service';


export abstract class ServiceFake<T extends IFlxEntity<TId>, TId extends IToString> implements IService {
  protected static readonly logger = getLogger(ServiceFake);

  private _topic: string;
  private _tableMetadata: TableMetadata;

  private _items: T[];


  protected constructor(model: Funktion, private metadataService: MetadataService,
    private _entityGenerator: EntityGenerator<T, TId>) {
    Assert.notNull(model);
    Assert.notNull(metadataService);

    this._tableMetadata = metadataService.findTableMetadata(model);
    this._topic = this._tableMetadata.options.name;

    this._items = this._entityGenerator.generate();
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
    item.id = this._entityGenerator.nextId();
    return Observable.of(item);
  }



  /**
   * Find all entities of type T and return {Observable<T[]>}.
   *
   * @returns {Observable<T[]>}
   *
   * @memberOf Service
   */
  public find(): Observable<T[]> {
    return Observable.of(this._items);
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

    const item = this._items.find((elem) => elem.id === id);
    return Observable.of(item);
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

    item.__version++;
    return Observable.of(item);
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

    const index = this._items.findIndex((item) => item.id === id);
    Assert.that(index >= 0 && index < this._items.length);
    this._items.slice(index, 1);

    return Observable.of(new ServiceResult(id, Status.Ok));
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
    return using(new XLog(ServiceFake.logger, levels.INFO, 'query'), (log) => {
      Assert.notNull(query, 'query');

      log.error(`query terms not used.`);
      return Observable.of(this._items);
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

  public getTopic(): string {
    return this._topic;
  }

  public getTopicPath(): string {
    throw new NotSupportedException();
  }

  public getUrl(): string {
    throw new NotSupportedException();
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