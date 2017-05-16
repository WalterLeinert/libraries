import * as Knex from 'knex';

// -------------------------- logging -------------------------------
// tslint:disable-next-line:no-unused-variable
import { getLogger, ILogger, levels, using, XLog } from '@fluxgate/platform';
// -------------------------- logging -------------------------------

// Fluxgate
import {
  Assert, Clone, Funktion, ICtor,
  IException, InvalidOperationException,
  IQuery, IToString,
  JsonSerializer, Types
} from '@fluxgate/core';

import {
  ColumnMetadata, EntityVersion, ExceptionWrapper, FindByIdResult, FindResult,
  IUser, QueryResult,
  ServiceResult, TableMetadata
} from '@fluxgate/common';


import { IFindService } from './find-service.interface';
import { KnexQueryVisitor } from './knex-query-visitor';
import { KnexService } from './knex.service';
import { MetadataService } from './metadata.service';




/**
 * Abstrakte Basisklasse für CRUD-Operationen auf der DB über knex.
 *
 * @export
 * @abstract
 * @class ServiceBase
 * @template T
 * @template TId
 */
export abstract class FindService<T, TId extends IToString> implements IFindService<T, TId>  {
  protected static logger = getLogger(FindService);
  private serializer: JsonSerializer = new JsonSerializer();

  private primaryKeyColumn: ColumnMetadata = null;
  private _metadata: TableMetadata;
  private _entityVersionMetadata: TableMetadata;


  /**
   * Creates an instance of ServiceBase.
   *
   * @param {{ new (): T }} ctor
   * @param {string} _tableName
   * @param {string} _idName
   *
   * @memberOf ServiceBase
   */
  constructor(table: Funktion, private _knexService: KnexService, metadataService: MetadataService) {
    Assert.notNull(table);
    Assert.notNull(_knexService);
    Assert.notNull(metadataService);

    this._metadata = metadataService.findTableMetadata(table);
    this._entityVersionMetadata = metadataService.findTableMetadata(EntityVersion);

    const cols = this.metadata.columnMetadata.filter((item: ColumnMetadata) => item.options.primary);
    if (cols.length <= 0) {
      FindService.logger.warn(`Table ${this.metadata.tableName}: no primary key column`);
    }
    this.primaryKeyColumn = cols[0];
  }

  /**
   * Liefert eine Entity-Instanz vom Typ {T} aus der DB als @see{Promise}
   *
   * @param {TId} id
   * @returns {Promise<T>}
   *
   * @memberOf ServiceBase
   */
  public findById(
    id: TId
  ): Promise<FindByIdResult<T, TId>> {

    return using(new XLog(FindService.logger, levels.INFO, 'findById', `[${this.tableName}] id = ${id}`), (log) => {

      return new Promise<FindByIdResult<T, TId>>((resolve, reject) => {
        this.knexService.knex.transaction((trx) => {

          this.fromTable()
            .where(this.idColumnName, id.toString())
            .transacting(trx)

            .then((rows: any[]) => {
              if (rows.length <= 0) {
                log.info('result: no item found');
                reject(this.createBusinessException(`table ${this.tableName}: item with id ${id} not found.`));
              } else {
                const result = this.createModelInstance(rows[0]);

                if (log.isDebugEnabled) {
                  //
                  // falls wir ein User-Objekt gefunden haben, wird für das Logging
                  // die Passwort-Info zurückgesetzt
                  //
                  const logResult = this.createModelInstance(Clone.clone(rows[0]));
                  if (Types.hasMethod(logResult, 'resetCredentials')) {
                    (logResult as any as IUser).resetCredentials();
                  }

                  log.debug('result = ', logResult);
                }

                // entityVersionMetadata vorhanden und wir suchen nicht entityVersionMetadata
                if (this.entityVersionMetadata && this.entityVersionMetadata !== this.metadata) {
                  this.findEntityVersionAndResolve(trx, FindByIdResult, result, resolve);
                } else {
                  trx.commit();
                  resolve(new FindByIdResult(result, -1));
                }
              }
            })
            .catch((err) => {
              log.error(err);

              trx.rollback();
              reject(this.createSystemException(err));
            });

        });     // transaction
      });     // promise
    });
  }


  /**
   * Liefert alle Entity-Instanzen vom Typ {T} als @see{Promise}
   *
   * @returns {Promise<T[]>}
   *
   * @memberOf ServiceBase
   */
  public find(
  ): Promise<FindResult<T>> {
    return using(new XLog(FindService.logger, levels.INFO, 'find', `[${this.tableName}]`), (log) => {

      return new Promise<FindResult<T>>((resolve, reject) => {
        this.knexService.knex.transaction((trx) => {

          this.fromTable()
            .transacting(trx)

            .then((rows) => {
              if (rows.length <= 0) {
                log.debug('result: no items');
                resolve(new FindResult([], undefined));
              } else {
                const result = this.createModelInstances(rows);

                if (log.isDebugEnabled) {
                  const logResult = this.createModelInstances(Clone.clone(rows));
                  //
                  // falls wir User-Objekte gefunden haben, wird für das Logging
                  // die Passwort-Info zurückgesetzt
                  //
                  if (logResult.length > 0) {
                    if (Types.hasMethod(logResult[0], 'resetCredentials')) {
                      logResult.forEach((item) => (item as any as IUser).resetCredentials());
                    }
                  }
                  log.debug('result = ', logResult);
                }

                // entityVersionMetadata vorhanden und wir suchen nicht entityVersionMetadata
                if (this.entityVersionMetadata && this.entityVersionMetadata !== this.metadata) {
                  this.findEntityVersionAndResolve(trx, FindResult, result, resolve);
                } else {
                  trx.commit();
                  resolve(new FindResult(result, -1));
                }
              }
            })
            .catch((err) => {
              log.error(err);

              trx.rollback();
              reject(this.createSystemException(err));
            });
        });     // transaction
      });     // promise
    });
  }


  /**
   * Führt die Query {query} aus und liefert ein Array von Entity-Instanzen vom Typ {T} als @see{Promise}
   *
   * @param {Knex.QueryBuilder} query
   * @returns {Promise<T[]>}
   *
   * @memberOf ServiceBase
   */
  public queryKnex(
    query: Knex.QueryBuilder
  ): Promise<QueryResult<T>> {

    return using(new XLog(FindService.logger, levels.INFO, 'queryKnex', `[${this.tableName}]`), (log) => {

      return new Promise<QueryResult<T>>((resolve, reject) => {
        this.knexService.knex.transaction((trx) => {

          query
            .transacting(trx)

            .then((rows) => {
              if (rows.length <= 0) {
                log.debug('result: no item found');

                trx.commit();
                resolve(new QueryResult([], undefined));
              } else {
                const result = this.createModelInstances(rows);

                if (log.isDebugEnabled) {
                  const logResult = Clone.clone(result);
                  //
                  // falls wir User-Objekte gefunden haben, wird für das Logging
                  // die Passwort-Info zurückgesetzt
                  //
                  if (logResult.length > 0) {
                    if (Types.hasMethod(logResult[0], 'resetCredentials')) {
                      logResult.forEach((item) => (item as any as IUser).resetCredentials());
                    }
                  }
                  log.debug('result = ', logResult);
                }

                // entityVersionMetadata vorhanden und wir suchen nicht entityVersionMetadata
                if (this.entityVersionMetadata && this.entityVersionMetadata !== this.metadata) {
                  this.findEntityVersionAndResolve(trx, QueryResult, result, resolve);
                } else {
                  trx.commit();
                  resolve(new QueryResult(result, -1));
                }
              }
            })
            .catch((err) => {
              log.error(err);

              trx.rollback();
              reject(this.createSystemException(err));
            });

        });     // transaction
      });     // promise
    });
  }


  public query(
    query: IQuery
  ): Promise<QueryResult<T>> {
    return using(new XLog(FindService.logger, levels.INFO, 'query', `[${this.tableName}]`), (log) => {
      let knexQuery = this.fromTable();

      const visitor = new KnexQueryVisitor(knexQuery, this.metadata);
      query.term.accept(visitor);

      return this.queryKnex(visitor.query(knexQuery));
    });
  }


  /**
   * Liefert die from(<table>) Clause für den aktuellen Tabellennamen
   *
   * @readonly
   * @protected
   * @type {Knex.QueryBuilder}
   * @memberOf ServiceBase
   */
  public fromTable(): Knex.QueryBuilder {
    return this.knexService.knex(this.tableName);
  }


  /**
   * Liefert den DB-Id-Spaltennamen (primary key column)
   *
   * @readonly
   * @type {string}
   * @memberOf ServiceBase
   */
  public get idColumnName(): string {
    if (!this.primaryKeyColumn) {
      throw new InvalidOperationException(`Table ${this.tableName}: no primary key column`);
    }
    return this.primaryKeyColumn.options.name;
  }


  /**
   * Setzt die "primary key" Spalte von "aussen". Diese wird als PK-Spalte verwendet, falls über die Metadaten
   * keine primaryKeyColumn definiert ist (kommt aus dem Controller).
   *
   * @param {string} name
   *
   * @memberOf BaseService
   */
  public set idColumnName(name: string) {
    Assert.notNullOrEmpty(name);

    using(new XLog(FindService.logger, levels.INFO, 'setIdColumn', `name = ${name}`), (log) => {
      if (!this.primaryKeyColumn) {
        const colMetadata = this.metadata.getColumnMetadataByProperty(name);
        if (!colMetadata) {
          const message = `Table ${this.tableName}: no (model) column with name: ${name}`;
          log.error(`message`);
          throw new InvalidOperationException(message);
        }

        log.warn(`Table ${this.tableName}: no primary key column: setting ${name} as primary key column`);
        this.primaryKeyColumn = colMetadata;
      }
    });
  }


  /**
   * Erzeugt aus der DB-Row @param{row} (JSON) eine Modellinstanz vom Typ @see{T}
   *
   * @protected
   * @param {*} row
   * @returns {T}
   *
   * @memberOf BaseService
   */
  protected createModelInstance(row: any): T {
    return this.metadata.createModelInstance<T>(row);
  }

  /**
   * Erzeugt aus dem Array von DB-Rows @param{rows} (JSON) ein Array von Modellinstanzen vom Typ @see{T}
   *
   * @protected
   * @param {any[]} rows
   * @returns {T[]}
   *
   * @memberOf BaseService
   */
  protected createModelInstances(rows: any[]): T[] {
    const result = new Array<T>();
    for (const row of rows) {
      result.push(this.metadata.createModelInstance<T>(row));
    }
    return result;
  }


  protected createBusinessException(error: string | IException | Error): IException {
    return ExceptionWrapper.createBusinessException(error);
  }

  protected createSystemException(error: string | IException | Error): IException {
    return ExceptionWrapper.createSystemException(error);
  }



  /**
   * Serialisiert das @param{item} für die Übertragung zum Client über das REST-Api.
   *
   * @param {any} item
   * @returns {any}
   */
  protected serialize<TSerialize>(item: TSerialize): any {
    Assert.notNull(item);
    return this.serializer.serialize(item);
  }


  /**
   * Deserialisiert das Json-Objekt, welches über das REST-Api vom Client zum Server übertragen wurde
   *
   * @param {any} json - Json-Objekt vom Client
   * @returns {any}
   *
   */
  protected deserialize<TSerialize>(json: any): TSerialize {
    Assert.notNull(json);
    return this.serializer.deserialize<TSerialize>(json);
  }


  /**
   * Liefert den DB-Tabellennamen
   *
   * @readonly
   * @type {string}
   * @memberOf ServiceBase
   */
  public get tableName(): string {
    return this.metadata.tableName;
  }

  protected get knexService(): KnexService {
    return this._knexService;
  }

  protected get metadata(): TableMetadata {
    return this._metadata;
  }

  protected get entityVersionMetadata(): TableMetadata {
    return this._entityVersionMetadata;
  }



  /**
   * ermittelt die aktuelle EntityVersion und legt diese zusammen mit dem Query-Ergebnis @param{queryResult}
   * in einer neuen Instanz vom Typ @see{resultClazz} ab, die im @see{resolve} zurückgeliefert wird.
   *
   * Die Operation ist in die Transaktion @param{trx} eingebunden.
   *
   * @private
   * @template TResult
   * @param {Knex.Transaction} trx
   * @param {ICtor<ServiceResult>} resultClazz
   * @param {TResult} queryResult
   * @param {(((result: ServiceResult | PromiseLike<ServiceResult>) => void))} resolve
   *
   * @memberof FindService
   */
  private findEntityVersionAndResolve<TResult>(trx: Knex.Transaction, resultClazz: ICtor<ServiceResult>,
    queryResult: TResult, resolve: ((result: ServiceResult | PromiseLike<ServiceResult>) => void)) {

    this.knexService.knex.table(this.entityVersionMetadata.tableName)
      .where(this.entityVersionMetadata.primaryKeyColumn.options.name, '=', this.tableName)
      .transacting(trx)
      .then((entityVersions) => {
        Assert.that(entityVersions.length === 1);

        const entityVersionRow = entityVersions[0];
        const entityVersion = entityVersionRow[this.entityVersionMetadata.versionColumn.options.name] as number;

        trx.commit();

        resolve(new resultClazz(queryResult, entityVersion));
      });
  };


}