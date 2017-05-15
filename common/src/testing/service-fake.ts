import 'rxjs/add/observable/of';
import { Observable } from 'rxjs/Observable';


// -------------------------------------- logging --------------------------------------------
// tslint:disable-next-line:no-unused-variable
import { getLogger, ILogger, levels, using, XLog } from '@fluxgate/platform';
// -------------------------------------- logging --------------------------------------------

import { Assert, Clone, InvalidOperationException, IQuery, IToString, NotSupportedException } from '@fluxgate/core';

import { EntityGenerator, EntityVersion, IFlxEntity, IService, TableMetadata } from '../model';
import { CreateServiceResult } from '../model/service/create-service-result';
import { DeleteServiceResult } from '../model/service/delete-service-result';
import { FindByIdServiceResult } from '../model/service/find-by-id-service-result';
import { FindServiceResult } from '../model/service/find-service-result';
import { QueryServiceResult } from '../model/service/query-service-result';
import { UpdateServiceResult } from '../model/service/update-service-result';

/**
 * abstrakte Basisklasse zur Simulation echter Services mit Hilfe von @see{EntityGenerator}
 *
 * @export
 * @abstract
 * @class ServiceFake
 * @implements {IService<T, TId>}
 * @template T
 * @template TId
 */
export abstract class ServiceFake<T extends IFlxEntity<TId>, TId extends IToString> implements IService<T, TId> {
  protected static readonly logger = getLogger(ServiceFake);

  private _items: T[];

  protected constructor(private _tableMetadata: TableMetadata, private _entityGenerator: EntityGenerator<T, TId>,
    private _entityVersionServiceFake?: ServiceFake<EntityVersion, string>) {
    Assert.notNull(_tableMetadata);
    Assert.notNull(_entityGenerator);

    this._items = this._entityGenerator.generate();

    // entityVersion aktualisieren
    this._items.forEach((item) => {
      this.incrementEntityVersion();
    });
  }


  /**
   * Create the entity {item} and return {Observable<T>}
   *
   * @param {T} item
   * @returns {Observable<T>}
   *
   * @memberOf Service
   */
  public create(item: T): Observable<CreateServiceResult<T>> {
    Assert.notNull(item, 'item');
    item.id = this._entityGenerator.nextId();

    this.incrementEntityVersion();

    this._items.push(item);
    return Observable.of(new CreateServiceResult<T>(item, this.getEntityVersion()));
  }



  /**
   * Find all entities of type T and return {Observable<T[]>}.
   *
   * @returns {Observable<T[]>}
   *
   * @memberOf Service
   */
  public find(): Observable<FindServiceResult<T>> {
    return Observable.of(new FindServiceResult<T>(this._items, this.getEntityVersion()));
  }


  /**
   * Find the entity with the given id and return {Observable<T>}
   *
   * @param {TId} id -- entity id.
   * @returns {Observable<T>}
   *
   * @memberOf Service
   */
  public findById(id: TId): Observable<FindByIdServiceResult<T, TId>> {
    Assert.notNull(id, 'id');

    const item = this._items.find((elem) => elem.id === id);
    return Observable.of(new FindByIdServiceResult<T, TId>(item, this.getEntityVersion()));
  }


  /**
   * Update the entity {item} with the given id and return {Observable<T>}
   *
   * @param {T} item
   * @returns {Observable<T>}
   *
   * @memberOf Service
   */
  public update(item: T): Observable<UpdateServiceResult<T>> {
    Assert.notNull(item, 'item');

    const itemCloned = Clone.clone(item);

    itemCloned.__version++;
    this.incrementEntityVersion();

    return Observable.of(new UpdateServiceResult<T>(itemCloned, this.getEntityVersion()));
  }


  /**
   * Delete the entity with the given id and return {Observable<T>}
   *
   * @param {TId} id
   * @returns {Observable<DeleteServiceResult<TId>>}
   *
   * @memberOf Service
   */
  public delete(id: TId): Observable<DeleteServiceResult<TId>> {
    Assert.notNull(id, 'id');

    const index = this._items.findIndex((item) => item.id === id);
    Assert.that(index >= 0 && index < this._items.length);
    this._items.splice(index, 1);

    this.incrementEntityVersion();

    return Observable.of(new DeleteServiceResult(id, this.getEntityVersion()));
  }


  /**
   * Finds all entities for the given query @param{query}
   *
   * @param {IQuery} query
   * @returns {Observable<T[]>}
   *
   * @memberOf Service
   */
  public query(query: IQuery): Observable<QueryServiceResult<T>> {
    return using(new XLog(ServiceFake.logger, levels.INFO, 'query'), (log) => {
      Assert.notNull(query, 'query');

      log.error(`query terms not used.`);
      return Observable.of(new QueryServiceResult<T>(this._items, this.getEntityVersion()));
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

  public getTopic(): string {
    return this._tableMetadata.options.name;
  }

  public getTopicPath(): string {
    throw new NotSupportedException();
  }

  public getUrl(): string {
    throw new NotSupportedException();
  }

  public get items(): T[] {
    return [...this._items];
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

  private incrementEntityVersion() {
    if (this._entityVersionServiceFake) {
      this._entityVersionServiceFake.items.find((ev) => ev.id === this.getTableName()).__version++;
    }
  }

  private getEntityVersion(): number {
    if (this._entityVersionServiceFake) {
      return this._entityVersionServiceFake.items.find((ev) => ev.id === this.getTableName()).__version;
    }
    throw new NotSupportedException();
  }
}