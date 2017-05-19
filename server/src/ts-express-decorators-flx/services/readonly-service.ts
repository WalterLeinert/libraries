import * as Knex from 'knex';

// -------------------------- logging -------------------------------
// tslint:disable-next-line:no-unused-variable
import { getLogger, ILogger, levels, using, XLog } from '@fluxgate/platform';
// -------------------------- logging -------------------------------

// Fluxgate
import {
  ColumnMetadata, EntityVersion, ExceptionWrapper, FindByIdResult, FindResult,
  IEntity, IUser, QueryResult,
  ServiceResult, TableMetadata, User
} from '@fluxgate/common';
import {
  Assert, Clone, Funktion, ICtor,
  IException, InvalidOperationException,
  IQuery, IToString,
  JsonSerializer, Types
} from '@fluxgate/core';


import { PassportSession } from '../session/passport-session';
import { ISession } from '../session/session.interface';
import { KnexQueryVisitor } from './knex-query-visitor';
import { KnexService } from './knex.service';
import { MetadataService } from './metadata.service';
import { IReadonlyService } from './readonly-service.interface';



/**
 * Abstrakte Basisklasse für CRUD-Operationen auf der DB über knex.
 *
 * @export
 * @abstract
 * @class ServiceBase
 * @template T
 * @template TId
 */
export abstract class ReadonlyService<T, TId extends IToString> implements IReadonlyService<T, TId>  {
  protected static logger = getLogger(ReadonlyService);
  private serializer: JsonSerializer = new JsonSerializer();

  private primaryKeyColumn: ColumnMetadata = null;
  private _metadata: TableMetadata;
  private _entityVersionMetadata: TableMetadata;
  private _userMetadata: TableMetadata;             // Mandantenfähigkeit /Clients


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
    this._userMetadata = metadataService.findTableMetadata(User);

    const cols = this.metadata.columnMetadata.filter((item: ColumnMetadata) => item.options.primary);
    if (cols.length <= 0) {
      ReadonlyService.logger.warn(`Table ${this.metadata.tableName}: no primary key column`);
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
  public findById<T extends IEntity<TId>>(
    session: ISession = undefined,
    id: TId
  ): Promise<FindByIdResult<T, TId>> {

    return using(new XLog(ReadonlyService.logger, levels.INFO, 'findById', `[${this.tableName}] id = ${id}`), (log) => {

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
                const result = this.createModelInstance(rows[0]) as any as T;

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

                if (session) {
                  // ggf. id_mandant der Ergebnis-Row mit der clientId des Users querchecken
                }

                // entityVersionMetadata vorhanden und wir suchen nicht entityVersionMetadata
                if (this.entityVersionMetadata && this.entityVersionMetadata !== this.metadata) {
                  this.findEntityVersionAndResolve(trx, FindByIdResult, result, resolve);
                } else {
                  trx.commit();
                  resolve(new FindByIdResult<T, TId>(result, -1));
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
    session: ISession = undefined
  ): Promise<FindResult<T>> {
    return using(new XLog(ReadonlyService.logger, levels.INFO, 'find', `[${this.tableName}]`), (log) => {

      return new Promise<FindResult<T>>((resolve, reject) => {
        this.knexService.knex.transaction((trx) => {

          const query = this.createClientSelectorQuery(session, trx);

          query

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
    session: ISession = undefined,
    query: Knex.QueryBuilder
  ): Promise<QueryResult<T>> {

    return using(new XLog(ReadonlyService.logger, levels.INFO, 'queryKnex', `[${this.tableName}]`), (log) => {

      return new Promise<QueryResult<T>>((resolve, reject) => {
        this.knexService.knex.transaction((trx) => {

          query = this.createClientSelectorQuery(session, trx, query);

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
    session: ISession = undefined,
    query: IQuery
  ): Promise<QueryResult<T>> {
    return using(new XLog(ReadonlyService.logger, levels.INFO, 'query', `[${this.tableName}]`), (log) => {
      let knexQuery = this.fromTable();

      const visitor = new KnexQueryVisitor(knexQuery, this.metadata);
      query.term.accept(visitor);

      return this.queryKnex(session, visitor.query(knexQuery));
    });
  }


  /**
   * Liefert einen QueryBuilder für die angegebene Tabelle @param{tableName}.
   * Default ist die aktuelle Tabelle des Services.
   *
   * @protected
   * @param {string} [tableName=this.tableName]
   * @returns {Knex.QueryBuilder}
   *
   * @memberof ReadonlyService
   */
  public fromTable(table: string | Function = this.tableName): Knex.QueryBuilder {
    Assert.notNull(table);

    let tableName: string;

    if (!Types.isPresent(table)) {
      tableName = this.tableName;
    } else {

      if (Types.isString(table)) {
        tableName = table as string;
      } else {
        tableName = (table as Funktion).name;
      }
    }

    return this.knexService.knex(tableName);
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

    using(new XLog(ReadonlyService.logger, levels.INFO, 'setIdColumn', `name = ${name}`), (log) => {
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
   * @memberof ReadonlyService
   */
  protected findEntityVersionAndResolve<TResult>(trx: Knex.Transaction, resultClazz: ICtor<ServiceResult>,
    queryResult: TResult, resolve: ((result: ServiceResult | PromiseLike<ServiceResult>) => void)) {

    using(new XLog(ReadonlyService.logger, levels.INFO, 'findEntityVersionAndResolve'), (log) => {

      this.knexService.knex.table(this.entityVersionMetadata.tableName)
        .where(this.entityVersionMetadata.primaryKeyColumn.options.name, '=', this.tableName)
        .transacting(trx)
        .then((entityVersions) => {
          Assert.that(entityVersions.length === 1);

          const entityVersionRow = entityVersions[0];
          const entityVersion = entityVersionRow[this.entityVersionMetadata.versionColumn.options.name] as number;

          trx.commit();

          log.debug('queryResult after commit: ', queryResult);

          resolve(new resultClazz(queryResult, entityVersion));
        });
    });
  };


  protected addIdSelector(qb: Knex.QueryBuilder, trx: Knex.Transaction, id: any):
    Knex.QueryBuilder {
    return this.addColumnSelector(qb, trx, this.idColumnName, id);
  }

  protected addClientSelector(qb: Knex.QueryBuilder, trx: Knex.Transaction, clientId: any):
    Knex.QueryBuilder {

    if (!this.metadata.clientColumn) {
      return qb;
    } else {
      return this.addColumnSelector(qb, trx, this.metadata.clientColumn.options.name, clientId);
    }
  }

  protected addVersionSelector(qb: Knex.QueryBuilder, trx: Knex.Transaction, version: number):
    Knex.QueryBuilder {

    if (!this.metadata.versionColumn) {
      return qb;
    } else {
      return this.addColumnSelector(qb, trx, this.metadata.versionColumn.options.name, version);
    }
  }


  /**
   * Fügt zum Querybuilder @param{qb} eine Selector-Query hinzu, die Selektion auf der aktuellen Entity auf die Spalte
   * @param{columnName} und den Wert @param{value} einschränkt.
   *
   * @private
   * @param {Knex.QueryBuilder} qb - der aktuelle Querybuilder
   * @param {Knex.Transaction} trx - die aktuelle Transaktion
   * @param {string} columnName - der Spaltenname
   * @param {any} value - der Spaltenwert
   * @returns {Knex.QueryBuilder}
   *
   * @memberof BaseService
   */
  protected addColumnSelector(qb: Knex.QueryBuilder, trx: Knex.Transaction, columnName: string, value: any):
    Knex.QueryBuilder {

    Assert.notNull(qb);
    Assert.notNull(trx);
    Assert.notNullOrEmpty(columnName);
    Assert.notNull(value);

    return using(new XLog(ReadonlyService.logger, levels.INFO, 'addSelectorQuery',
      `columnName = ${columnName}, value = ${value}`), (log) => {
        return qb
          .andWhere(columnName, value)
          .transacting(trx);
      });
  }



  /**
   * Liefert eine Knex-Query, die für die aktuelle Tabelle alle Rows liefert.
   * Ist @param{session} vorhanden, werden nur die Rows mit der ClientId des Users der Session geliefert
   *
   * @protected
   * @param {ISession} session
   * @param {Knex.Transaction} trx
   * @returns {Knex.QueryBuilder}
   *
   * @memberof ReadonlyService
   */
  protected createClientSelectorQuery(session: ISession, trx: Knex.Transaction,
    query?: Knex.QueryBuilder): Knex.QueryBuilder {

    // Knex-Beispielcode:
    // this._knexService.knex
    //   .from('artikel')
    //   .innerJoin('user', 'artikel.id_mandant', 'user.id_mandant')
    //   .andWhere('user.user_id', userId).then((res) => {
    //    ...
    //   });

    if (!query) {
      query = this.fromTable();
    }

    // TODO: workaround
    if (session && (session instanceof PassportSession)) {
      return query;
    }

    if (session) {
      let userColumnSelector: string;
      let userIdValue: number;

      //
      // falls eine (synthetische) PassportSession vorliegt, existiert nur die clientId, da noch
      // kein Login gelaufen ist.
      // Bei einer normalen ExpressSession legt Passport die user-id darin ab.
      //
      if (session instanceof PassportSession) {
        userColumnSelector = `${this._userMetadata.clientColumn.options.name}`;
        userIdValue = (session as PassportSession).clientId;
      } else {
        userColumnSelector = `${this._userMetadata.primaryKeyColumn.options.name}`;
        userIdValue = session.passport.user;
      }

      query = query
        .select(`${this.tableName}.*`)
        .innerJoin(this._userMetadata.tableName,                                              // .innerJoin('user',
        `${this.tableName}.${this.metadata.clientColumn.options.name}`,                       //    'artikel.id_mandant',
        `${this._userMetadata.tableName}.${this._userMetadata.clientColumn.options.name}`)    //    'user.id_mandant')
        .andWhere(`${this._userMetadata.tableName}.` +                                        // .andWhere('user.user_id/id_mandant',
        userColumnSelector, userIdValue);                                                     //      userId/clientId)
    }

    return query
      .transacting(trx);
  }
}