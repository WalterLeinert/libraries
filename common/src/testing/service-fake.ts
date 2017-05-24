import 'rxjs/add/observable/of';
import { Observable } from 'rxjs/Observable';


// -------------------------------------- logging --------------------------------------------
// tslint:disable-next-line:no-unused-variable
import { getLogger, ILogger, levels, using, XLog } from '@fluxgate/platform';
// -------------------------------------- logging --------------------------------------------

import { Assert, Clone, InvalidOperationException, IQuery, IToString, NotSupportedException } from '@fluxgate/core';

import {
  EntityGenerator, EntityVersion, IEntity, IFlxEntity, IService, TableMetadata, VersionedEntity
} from '../model';
import { CreateResult } from '../model/service/create-result';
import { DeleteResult } from '../model/service/delete-result';
import { FindByIdResult } from '../model/service/find-by-id-result';
import { FindResult } from '../model/service/find-result';
import { QueryResult } from '../model/service/query-result';
import { UpdateResult } from '../model/service/update-result';

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
export abstract class ServiceFake<T extends IEntity<TId>, TId extends IToString> implements IService<T, TId> {
  protected static readonly logger = getLogger(ServiceFake);

  private _items: Array<IEntity<TId>>;

  protected constructor(private _tableMetadata: TableMetadata,
    private _entityGenerator: EntityGenerator<IEntity<TId>, TId>,
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
  public create<T extends IFlxEntity<TId>>(item: T): Observable<CreateResult<T, TId>> {
    Assert.notNull(item, 'item');
    item.id = this._entityGenerator.nextId();

    this.incrementEntityVersion();

    this._items.push(item);
    return Observable.of(new CreateResult<T, TId>(item, this.getEntityVersion()));
  }



  /**
   * Find all entities of type T and return {Observable<T[]>}.
   *
   * @returns {Observable<T[]>}
   *
   * @memberOf Service
   */
  public find<T extends IFlxEntity<TId>>(): Observable<FindResult<T>> {
    return Observable.of(new FindResult(this._items, this.getEntityVersion()));
  }


  /**
   * Find the entity with the given id and return {Observable<T>}
   *
   * @param {TId} id -- entity id.
   * @returns {Observable<T>}
   *
   * @memberOf Service
   */
  public findById<T extends IFlxEntity<TId>>(id: TId): Observable<FindByIdResult<T, TId>> {
    Assert.notNull(id, 'id');

    const item = this._items.find((elem) => elem.id === id);
    return Observable.of(new FindByIdResult(item, this.getEntityVersion()));
  }


  /**
   * Update the entity {item} with the given id and return {Observable<T>}
   *
   * @param {T} item
   * @returns {Observable<T>}
   *
   * @memberOf Service
   */
  public update<T extends IFlxEntity<TId>>(item: T): Observable<UpdateResult<T, TId>> {
    Assert.notNull(item, 'item');

    const itemCloned = Clone.clone(item);

    itemCloned.__version++;
    this.incrementEntityVersion();

    return Observable.of(new UpdateResult(itemCloned, this.getEntityVersion()));
  }


  /**
   * Delete the entity with the given id and return {Observable<T>}
   *
   * @param {TId} id
   * @returns {Observable<DeleteResult<TId>>}
   *
   * @memberOf Service
   */
  public delete(id: TId): Observable<DeleteResult<TId>> {
    Assert.notNull(id, 'id');

    const index = this._items.findIndex((item) => item.id === id);
    Assert.that(index >= 0 && index < this._items.length);
    this._items.splice(index, 1);

    this.incrementEntityVersion();

    return Observable.of(new DeleteResult(id, this.getEntityVersion()));
  }


  /**
   * Finds all entities for the given query @param{query}
   *
   * @param {IQuery} query
   * @returns {Observable<T[]>}
   *
   * @memberOf Service
   */
  public query<T extends IFlxEntity<TId>>(query: IQuery): Observable<QueryResult<T>> {
    return using(new XLog(ServiceFake.logger, levels.INFO, 'query'), (log) => {
      Assert.notNull(query, 'query');

      log.error(`query terms not used.`);
      return Observable.of(new QueryResult(this._items, this.getEntityVersion()));
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

  public get items(): Array<IEntity<TId>> {
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
  public get tableMetadata(): TableMetadata {
    return this._tableMetadata;
  }

  private incrementEntityVersion() {
    if (this._entityVersionServiceFake) {
      const versionedEntity = this._entityVersionServiceFake.items.find((ev) => ev.id === this.getTableName());
      if (versionedEntity instanceof VersionedEntity) {
        versionedEntity.__version++;
      } else {
        throw new InvalidOperationException(`Entity ${this.getModelClassName} ist not versioned`);
      }
    }
  }

  private getEntityVersion(): number {
    if (this._entityVersionServiceFake) {
      const versionedEntity = this._entityVersionServiceFake.items.find((ev) => ev.id === this.getTableName());
      if (versionedEntity instanceof VersionedEntity) {
        return versionedEntity.__version;
      } else {
        throw new InvalidOperationException(`Entity ${this.getModelClassName} ist not versioned`);
      }
    }
    throw new NotSupportedException();
  }
}