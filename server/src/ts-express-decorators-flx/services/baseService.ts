import * as Knex from 'knex';

// -------------------------- logging -------------------------------
// tslint:disable-next-line:no-unused-variable
import { getLogger, ILogger, levels, using, XLog } from '@fluxgate/platform';
// -------------------------- logging -------------------------------

// Fluxgate
import {
  Assert, Clone, /*EntityExistsException,*/
  EntityNotFoundException, Funktion,
  IException,
  InvalidOperationException, IToString,
  JsonSerializer, OptimisticLockException, Types
} from '@fluxgate/core';

import { ColumnMetadata, ExceptionWrapper, IQuery, IUser, ServiceResult, TableMetadata } from '@fluxgate/common';


import { IBaseService } from './baseService.interface';
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
export abstract class BaseService<T, TId extends IToString> implements IBaseService<T, TId>  {
  protected static logger = getLogger(BaseService);
  private serializer: JsonSerializer = new JsonSerializer();

  private primaryKeyColumn: ColumnMetadata = null;
  private metadata: TableMetadata;


  /**
   * Creates an instance of ServiceBase.
   *
   * @param {{ new (): T }} ctor
   * @param {string} _tableName
   * @param {string} _idName
   *
   * @memberOf ServiceBase
   */
  constructor(table: Funktion, private knexService: KnexService, private metadataService: MetadataService) {
    this.metadata = this.metadataService.findTableMetadata(table);

    const cols = this.metadata.columnMetadata.filter((item: ColumnMetadata) => item.options.primary);
    if (cols.length <= 0) {
      BaseService.logger.warn(`Table ${this.metadata.options.name}: no primary key column`);
    }
    this.primaryKeyColumn = cols[0];;
  }


  /**
   * Erzeugt eine neue Entity-Instanz vom Typ {T} in der DB und liefert die Instanz als @see{Promise}
   *
   * @param {T} subject
   * @returns {Promise<T>}
   *
   * @memberOf ServiceBase
   */
  public create(
    subject: T
  ): Promise<T> {

    return using(new XLog(BaseService.logger, levels.INFO, 'create', `[${this.tableName}]`), (log) => {
      if (log.isDebugEnabled) {
        log.debug('subject: ', subject);
      }

      const dbSubject = this.createDatabaseInstance(subject);

      if (log.isDebugEnabled()) {
        log.debug('dbSubject: ', dbSubject);
      }

      return new Promise<T>((resolve, reject) => {
        this.knexService.knex.transaction((trx) => {

          this.fromTable()
            .insert(dbSubject)
            .transacting(trx)

            .then((ids: number[]) => {

              if (ids.length <= 0) {
                log.error(`ids empty`);
                reject(this.createSystemException('create failed: ids empty'));
              } else if (ids.length > 1) {
                reject(this.createSystemException('create failed: ids.length > 1'));
              } else {
                const id = ids[0];
                log.debug(`created new ${this.tableName} with id: ${id}`);

                // Id der neuen Instanz zuweisen
                dbSubject[this.idColumnName] = id;

                subject = this.createModelInstance(dbSubject);

                trx.commit();
                resolve(subject);
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
   * Liefert eine Entity-Instanz vom Typ {T} aus der DB als @see{Promise}
   *
   * @param {TId} id
   * @returns {Promise<T>}
   *
   * @memberOf ServiceBase
   */
  public findById(
    id: TId
  ): Promise<T> {

    return using(new XLog(BaseService.logger, levels.INFO, 'findById', `[${this.tableName}] id = ${id}`), (log) => {

      return new Promise<T>((resolve, reject) => {
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

                trx.commit();
                resolve(result);
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
  ): Promise<T[]> {
    return using(new XLog(BaseService.logger, levels.INFO, 'find', `[${this.tableName}]`), (log) => {

      return new Promise<T[]>((resolve, reject) => {
        this.knexService.knex.transaction((trx) => {

          this.fromTable()
            .transacting(trx)

            .then((rows) => {
              if (rows.length <= 0) {
                log.debug('result: no items');
                resolve(new Array<T>());
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

                trx.commit();
                resolve(result);
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
   * Aktualisiert die Entity-Instanz {subject} vom Typ {T} in der DB und liefert die Instanz als @see{Promise}
   *
   * @param {T} subject
   * @returns {Promise<T>}
   *
   * @memberOf ServiceBase
   */
  public update(
    subject: T
  ): Promise<T> {

    return using(new XLog(BaseService.logger, levels.INFO, 'update', `[${this.tableName}]`), (log) => {
      log.debug('subject: ', subject);

      const dbSubject = this.createDatabaseInstance(subject);

      return new Promise<T>((resolve, reject) => {
        this.knexService.knex.transaction((trx) => {

          let delayMillisecs = 0;

          if (this.metadata.testColumn) {
            log.info(`testColumn exists: ${this.metadata.testColumn.propertyName}`);

            const testValue = subject[this.metadata.testColumn.propertyName];
            if (testValue) {
              delayMillisecs = +testValue;
              log.info(`delay = ${delayMillisecs} [ms]`);
            }
          }

          // TODO: setTimeout(() => {

          let query: Knex.QueryBuilder = this.fromTable()
            .where(this.idColumnName, dbSubject[this.idColumnName]);

          // "leere"" query
          let entityversionQuery: Knex.QueryBuilder = this.knexService.knex.table('entityversion');

          /**
           * falls eine Version-Column vorliegt, müssen wir
           * - die Entity-Version in die Query einbauen
           * - und die Version erhöhen
           */
          if (this.metadata.versionColumn) {
            const andWhereColumnName = this.metadata.versionColumn.options.name;

            const version: number = dbSubject[this.metadata.versionColumn.options.name];
            const andWhereValue = version;

            dbSubject[andWhereColumnName] = version + 1;

            query = query.andWhere(andWhereColumnName, '=', andWhereValue);

            log.debug(`query prepared for updating version in table ${this.tableName}`);

            // query zum Inkrement der Version in Tabelle entityversion
            entityversionQuery = this.createEntityVersionIncrement(trx);

            log.debug(`query prepared for updating version in entityversion for table ${this.tableName}`);
          }

          log.debug('dbSbject: ', dbSubject);

          entityversionQuery
            .then((item) => {

              query
                .update(dbSubject)
                .transacting(trx)

                .then((affectedRows: number) => {
                  log.debug(`updated ${this.tableName} with id: ${dbSubject[this.idColumnName]}` +
                    ` (affectedRows: ${affectedRows})`, );

                  if (this.metadata.versionColumn) {
                    if (affectedRows <= 0) {
                      trx.rollback();

                      const exc = new OptimisticLockException(
                        `table: ${this.tableName}, id: ${dbSubject[this.idColumnName]}`);

                      log.error(exc);
                      reject(exc);
                    } else {

                      subject = this.createModelInstance(dbSubject);

                      trx.commit();

                      log.debug('subject after commit: ', subject);
                      resolve(subject);
                    }
                  } else {
                    if (affectedRows <= 0) {
                      trx.rollback();

                      const exc = new EntityNotFoundException(
                        `table: ${this.tableName}, id: ${dbSubject[this.idColumnName]}`);
                      log.error(exc);

                      reject(exc);
                    } else {
                      subject = this.createModelInstance(dbSubject);

                      trx.commit();

                      log.debug('subject after commit: ', subject);
                      resolve(subject);
                    }
                  }
                })
                .catch((err) => {
                  log.error(err);

                  trx.rollback();
                  reject(this.createSystemException(err));
                });
              //  }, delayMillisecs);
            });

        });     // transaction
      });     // promise
    });
  }


  /**
   * Löscht eine Entity-Instanz vom Typ {T} in der DB und liefert die {Id} als @see{Promise}
   *
   * @param {TId} id
   * @returns {Promise<TId>}
   *
   * @memberOf ServiceBase
   */
  public delete(
    id: TId
  ): Promise<ServiceResult<TId>> {

    return using(new XLog(BaseService.logger, levels.INFO, 'delete', `[${this.tableName}] id = ${id}`), (log) => {
      return new Promise<ServiceResult<TId>>((resolve, reject) => {
        this.knexService.knex.transaction((trx) => {

          this.fromTable()
            .where(this.idColumnName, id.toString())
            .del()
            .transacting(trx)

            .then((affectedRows: number) => {
              log.debug(`deleted from ${this.tableName} with id: ${id} (affectedRows: ${affectedRows})`);

              const res = new ServiceResult<TId>(id);

              if (affectedRows <= 0) {
                trx.rollback();
                reject(this.createSystemException(
                  new EntityNotFoundException(`table: ${this.tableName}, id: ${id}`)));
              } else {
                // TODO: serialize z.Zt. nicht kompatibel
                trx.commit();
                resolve(res);
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
  ): Promise<T[]> {

    return using(new XLog(BaseService.logger, levels.INFO, 'queryKnex', `[${this.tableName}]`), (log) => {

      return new Promise<T[]>((resolve, reject) => {
        this.knexService.knex.transaction((trx) => {

          query
            .transacting(trx)

            .then((rows) => {
              if (rows.length <= 0) {
                log.debug('result: no item found');

                trx.commit();
                resolve(new Array<T>());
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

                trx.commit();
                resolve(result);
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
  ): Promise<T[]> {
    return using(new XLog(BaseService.logger, levels.INFO, 'query', `[${this.tableName}]`), (log) => {
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

    using(new XLog(BaseService.logger, levels.INFO, 'setIdColumn', `name = ${name}`), (log) => {
      if (!this.primaryKeyColumn) {
        const colMetadata = this.metadata.getColumnMetadataByProperty(name);
        if (!colMetadata) {
          const message = `Table ${this.tableName}: no (model) column with name: ${name}`;
          BaseService.logger.error(`message`);
          throw new InvalidOperationException(message);
        }

        log.warn(`Table ${this.tableName}: no primary key column: setting ${name} as primary key column`);
        this.primaryKeyColumn = colMetadata;
      }
    });
  }



  protected createDatabaseInstance(entity: T): any {
    return this.metadata.createDatabaseInstance<T>(entity);
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
    return this.metadata.options.name;
  }


  /**
   * Liefert eine Query, die für die aktuelle Transaktion @param{trx} und Tabelle die
   * Version in der Tabelle 'entityversion' um eins erhöht.
   *
   * @private
   * @param {Knex.Transaction} trx
   * @returns {Knex.QueryBuilder}
   *
   * @memberof BaseService
   */
  private createEntityVersionIncrement(trx: Knex.Transaction): Knex.QueryBuilder {
    return this.knexService.knex.table('entityversion')
      .where('entityversion_id', '=', this.tableName)
      .increment('entityversion_version', 1)
      .transacting(trx);
  }


}