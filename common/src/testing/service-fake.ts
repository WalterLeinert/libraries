import 'rxjs/add/observable/of';
import { Observable } from 'rxjs/Observable';
import { Subscriber } from 'rxjs/Subscriber';


// -------------------------------------- logging --------------------------------------------
// tslint:disable-next-line:no-unused-variable
import { getLogger, ILogger, levels, using, XLog } from '@fluxgate/platform';
// -------------------------------------- logging --------------------------------------------

import {
  Assert, Clone, IException, InvalidOperationException, IQuery,
  IToString, NotSupportedException
} from '@fluxgate/core';

import {
  EntityGenerator, EntityVersion, IEntity, IFlxEntity, IService, TableMetadata, VersionedEntity
} from '../model';
import { CreateResult } from '../model/service/create-result';
import { DeleteResult } from '../model/service/delete-result';
import { FindByIdResult } from '../model/service/find-by-id-result';
import { FindResult } from '../model/service/find-result';
import { QueryResult } from '../model/service/query-result';
import { StatusFilter } from '../model/service/status-filter';
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
  public create(item: T, exception?: IException): Observable<CreateResult<T, TId>> {
    Assert.notNull(item, 'item');

    return Observable.create((observer: Subscriber<CreateResult<T, TId>>) => {
      if (exception) {
        observer.error(exception);
      } else {
        item.id = this._entityGenerator.nextId();

        this.incrementEntityVersion();

        this._items.push(item);
        observer.next(new CreateResult<T, TId>(item, this.getEntityVersion()));
      }
    });
  }



  /**
   * Find all entities of type T and return {Observable<T[]>}.
   *
   * @returns {Observable<T[]>}
   *
   * @memberOf Service
   */
  public find(filter?: StatusFilter, exception?: IException): Observable<FindResult<T>> {
    return Observable.create((observer: Subscriber<FindResult<T>>) => {
      if (exception) {
        observer.error(exception);
      } else {
        observer.next(new FindResult(this._items as any[], this.getEntityVersion()));
      }
    });
  }


  /**
   * Find the entity with the given id and return {Observable<T>}
   *
   * @param {TId} id -- entity id.
   * @returns {Observable<T>}
   *
   * @memberOf Service
   */
  public findById(id: TId, exception?: IException): Observable<FindByIdResult<T, TId>> {
    Assert.notNull(id, 'id');

    return Observable.create((observer: Subscriber<FindByIdResult<T, TId>>) => {
      if (exception) {
        observer.error(exception);
      } else {
        const items = this._items.filter((elem) => elem.id === id);

        observer.next(new FindByIdResult<T, TId>(
          (items.length === 1 ? items[0] as any : undefined), this.getEntityVersion()));
      }
    });
  }



  /**
   * Update the entity {item} with the given id and return {Observable<T>}
   *
   * @param {T} item
   * @returns {Observable<T>}
   *
   * @memberOf Service
   */
  public update<TFlx extends IFlxEntity<TId>>(item: TFlx, exception?: IException): Observable<UpdateResult<TFlx, TId>> {
    Assert.notNull(item, 'item');

    return Observable.create((observer: Subscriber<UpdateResult<TFlx, TId>>) => {
      if (exception) {
        observer.error(exception);
      } else {
        const itemCloned = Clone.clone(item);

        itemCloned.__version++;
        this.incrementEntityVersion();

        observer.next(new UpdateResult(itemCloned, this.getEntityVersion()));
      }
    });
  }


  /**
   * Delete the entity with the given id and return {Observable<T>}
   *
   * @param {TId} id
   * @returns {Observable<DeleteResult<TId>>}
   *
   * @memberOf Service
   */
  public delete(id: TId, exception?: IException): Observable<DeleteResult<TId>> {
    Assert.notNull(id, 'id');

    return Observable.create((observer: Subscriber<DeleteResult<TId>>) => {
      if (exception) {
        observer.error(exception);
      } else {
        const index = this._items.findIndex((item) => item.id === id);
        Assert.that(index >= 0 && index < this._items.length);
        this._items.splice(index, 1);

        this.incrementEntityVersion();

        observer.next(new DeleteResult(id, this.getEntityVersion()));
      }
    });
  }


  /**
   * Finds all entities for the given query @param{query}
   *
   * @param {IQuery} query
   * @returns {Observable<T[]>}
   *
   * @memberOf Service
   */
  public query(query: IQuery, exception?: IException): Observable<QueryResult<T>> {
    return using(new XLog(ServiceFake.logger, levels.INFO, 'query'), (log) => {
      Assert.notNull(query, 'query');

      return Observable.create((observer: Subscriber<QueryResult<T>>) => {
        if (exception) {
          observer.error(exception);
        } else {

          log.warn(`query terms not used.`);
          observer.next(new QueryResult(this._items as any[], this.getEntityVersion()));
        }
      });
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