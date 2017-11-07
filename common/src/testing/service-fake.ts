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
  EntityGenerator, EntityStatus, EntityVersion, FlxStatusEntity, IEntity, IFlxEntity, IFlxStatusEntity,
  IService, TableMetadata, VersionedEntity
} from '../model';
import { CreateResult } from '../model/service/create-result';
import { DeleteResult } from '../model/service/delete-result';
import { FindByIdResult } from '../model/service/find-by-id-result';
import { FindResult } from '../model/service/find-result';
import { QueryResult } from '../model/service/query-result';
import { FilterBehaviour, StatusFilter } from '../model/service/status-filter';
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
        observer.next(new CreateResult<T, TId>(item, this.getEntityVersion(this.getTableName())));
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

        let items = this._items;

        if (this._tableMetadata.statusColumnKeys.length > 0) {
          const statusColumn = this._tableMetadata.statusColumn;

          // defaults
          let behaviour = FilterBehaviour.None;
          let status = EntityStatus.None;

          if (filter && filter instanceof StatusFilter) {
            behaviour = filter.behaviour;
            status = filter.status;
          }

          switch (behaviour) {
            // only items with matching status
            case FilterBehaviour.None:
              items = this._items.filter((item: FlxStatusEntity<TId>) => item.__status === 0);
              break;

            // items + items with matching status
            case FilterBehaviour.Add:
              items = this._items.filter((item: FlxStatusEntity<TId>) =>
                item.__status === 0 || item.getStatus(status));
              break;

            // only items with matching status
            case FilterBehaviour.Only:
              items = this._items.filter((item: FlxStatusEntity<TId>) => item.getStatus(status));
              break;

            // items + items without matching status
            case FilterBehaviour.Exclude:
              items = this._items.filter((item: FlxStatusEntity<TId>) =>
                item.__status === 0 || !item.getStatus(status));
              break;

            default:
              throw new InvalidOperationException(`unsupported filter behaviour: ${behaviour}`);
          }
        }

        observer.next(new FindResult(items as any[], this.getEntityVersion(this.getTableName())));
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
          (items.length === 1 ? items[0] as any : undefined), this.getEntityVersion(this.getTableName())));
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
  public update(item: T, exception?: IException): Observable<UpdateResult<T, TId>> {
    Assert.notNull(item, 'item');

    return Observable.create((observer: Subscriber<UpdateResult<T, TId>>) => {
      if (exception) {
        observer.error(exception);
      } else {
        const itemCloned = Clone.clone(item);

        if (itemCloned instanceof FlxStatusEntity) {
          itemCloned.__version++;
          this.incrementEntityVersion();
        }

        const items = this._items.map((it) => it.id === item.id ? itemCloned : it);
        this._items = [...items];

        observer.next(new UpdateResult(itemCloned, this.getEntityVersion(this.getTableName())));
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

        observer.next(new DeleteResult(id, this.getEntityVersion(this.getTableName())));
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
          observer.next(new QueryResult(this._items as any[], this.getEntityVersion(this.getTableName())));
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


  /**
   * simuliert die Aktualisierung der Version der aktuellen Entity in der EntityVersion-Tabelle über den
   * Fake-Service _entityVersionServiceFake nach CRUD-Operationen
   */
  private incrementEntityVersion() {
    //
    // nicht bei der EntityVersion-Tabelle selbst!
    //
    if (this.getTableName() !== EntityVersion.TABLE_NAME) {
      const versionedEntity = this._entityVersionServiceFake.items.find((ev) => ev.id === this.getTableName());
      if (versionedEntity instanceof VersionedEntity) {
        versionedEntity.__version++;
      } else {
        throw new InvalidOperationException(`Entity ${this.getModelClassName} ist not versioned`);
      }
    }
  }


  /**
   * simuliert die EntityVersion-Tabelle und liefert für die Tabelle @param{tableName} die max. entity version.
   *
   * @param tableName
   */
  private getEntityVersion(tableName: string): number {

    // sucht in items nach dem Item mit der Id itemId
    const finder = (itemId: string, items: Array<IEntity<string>>) => {
      const versionedEntity = items.find((ev) => ev.id === itemId);
      if (versionedEntity instanceof VersionedEntity) {
        return versionedEntity.__version;
      } else {
        throw new InvalidOperationException(`Entity ${this.getModelClassName} ist not versioned`);
      }
    };

    //
    // nicht bei der EntityVersion-Tabelle selbst!
    //
    if (this.getTableName() !== EntityVersion.TABLE_NAME) {
      return finder(tableName, this._entityVersionServiceFake.items);
    } else {
      return finder(tableName, this._items.map((it) => it as any as IEntity<string>));
    }
  }
}