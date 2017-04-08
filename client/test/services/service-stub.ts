import 'rxjs/add/observable/of';
import { Observable } from 'rxjs/Observable';


// -------------------------------------- logging --------------------------------------------
import { getLogger, ILogger, levels, using, XLog } from '@fluxgate/common';
// -------------------------------------- logging --------------------------------------------


import {
  Assert, ColumnMetadata, Funktion, IFlxEntity, InvalidOperationException, IQuery, IService, IToString,
  NotSupportedException, ServiceResult, ShortTime,
  Status, TableMetadata, Time
} from '@fluxgate/common';

import { MetadataService } from '../../src/angular/services/metadata.service';
import { IIdGenerator } from './id-generator.interface';


export abstract class ServiceStub<T extends IFlxEntity<TId>, TId extends IToString> implements IService {
  protected static readonly logger = getLogger(ServiceStub);

  private _topic: string;
  private _tableMetadata: TableMetadata;

  private _items: T[];


  protected constructor(model: Funktion, private metadataService: MetadataService,
    private _idGenerator: IIdGenerator<TId>) {
    Assert.notNull(model);
    Assert.notNull(metadataService);

    this._tableMetadata = metadataService.findTableMetadata(model);
    this._topic = metadataService.findTableMetadata(model).options.name;

    this._items = this.createItems(10);
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

    item.id = this._idGenerator.next();

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
    return using(new XLog(ServiceStub.logger, levels.INFO, 'query'), (log) => {
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
   * erzeut ein Array vom Typ @see{T} mit @param{maxItems} Elementen.
   * Die Elementwerte werden anhand des Typs automatisch erzeugt.
   *
   * @param maxItems
   */
  protected createItems(maxItems: number): T[] {
    return using(new XLog(ServiceStub.logger, levels.INFO, 'createItems'), (log) => {
      const items: T[] = [];
      for (let i = 0; i < maxItems; i++) {
        const item = this.createEntity<T>();

        this.tableMetadata.columnMetadata.forEach((metadata) => {
          if (metadata.options.primary) {
            item.id = this.idGenerator.next();
          } else if (metadata.options.persisted) {
            item[metadata.propertyName] = this.createPropertyValue(i, metadata);
          }
        });

        items.push(item);
      }

      log.log(`${JSON.stringify(items)}`);

      return items;
    });
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

  protected createEntity<T>(): T {
    return this._tableMetadata.createEntity<T>();
  }

  protected get idGenerator(): IIdGenerator<TId> {
    return this._idGenerator;
  }


  /**
   * Erzeugt für das i-te Element und den Metadaten @param{metadata} einen synthetisch erzeugten Wert.
   *
   * @private
   * @param {number} i
   * @param {ColumnMetadata} metadata
   * @returns {*}
   *
   * @memberOf ServiceStub
   */
  private createPropertyValue(i: number, metadata: ColumnMetadata): any {
    let rval;

    switch (metadata.propertyType) {
      case 'int':
      case 'integer':
      case 'bigint':
      case 'number':
        rval = i;
        break;

      case 'float':
      case 'double':
        rval = i;
        break;

      case 'text':
      case 'string':
        rval = `${metadata.propertyName}-${i}`;
        break;

      case 'boolean':
        rval = false;
        break;

      case 'date':
        rval = new Date();
        break;

      case 'shorttime':
        rval = new ShortTime(20, 15);
        break;

      case 'time':
        rval = new Time(20, 15, 0);
        break;

      default:
        throw new NotSupportedException(`column ${metadata.propertyName}: type ${metadata.propertyType}`);
    }

    return rval;
  }


}