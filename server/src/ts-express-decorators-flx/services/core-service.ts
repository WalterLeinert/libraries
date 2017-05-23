import * as Knex from 'knex';

// -------------------------- logging -------------------------------
// tslint:disable-next-line:no-unused-variable
import { getLogger, ILogger, levels, using, XLog } from '@fluxgate/platform';
// -------------------------- logging -------------------------------

// Fluxgate
import {
  EntityVersion, ExceptionWrapper, FindResult, IUser, QueryResult,
  ServiceResult, TableMetadata, User
} from '@fluxgate/common';
import {
  Assert, Clone, Funktion, ICtor,
  IException,
  IQuery, IToString,
  JsonSerializer, Types
} from '@fluxgate/core';


import { IBodyRequest } from '../session/body-request.interface';
import { ISessionRequest } from '../session/session-request.interface';
import { ICoreService } from './core-service.interface';
import { KnexQueryVisitor } from './knex-query-visitor';
import { KnexService } from './knex.service';
import { MetadataService } from './metadata.service';


/**
 * Abstrakte Basisklasse für REST-Services auf Entities ohne Id
 *
 * @export
 * @abstract
 * @class CoreService
 * @template T
 * @template TId
 */
export abstract class CoreService<T, TId extends IToString> implements ICoreService<T, TId>  {
  protected static logger = getLogger(CoreService);
  private serializer: JsonSerializer = new JsonSerializer();

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
  }



  /**
   * Liefert alle Entity-Instanzen vom Typ {T} als @see{Promise}
   *
   * @returns {Promise<T[]>}
   *
   * @memberOf ServiceBase
   */
  public find(
    request: ISessionRequest
  ): Promise<FindResult<T>> {
    return using(new XLog(CoreService.logger, levels.INFO, 'find', `[${this.tableName}]`), (log) => {

      return new Promise<FindResult<T>>((resolve, reject) => {
        this.knexService.knex.transaction((trx) => {

          const query = this.createClientSelectorQuery(request, trx);

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
                if (this.hasEntityVersionInfo()) {
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
    request: ISessionRequest,
    query: Knex.QueryBuilder
  ): Promise<QueryResult<T>> {

    return using(new XLog(CoreService.logger, levels.INFO, 'queryKnex', `[${this.tableName}]`), (log) => {

      return new Promise<QueryResult<T>>((resolve, reject) => {
        this.knexService.knex.transaction((trx) => {

          query = this.createClientSelectorQuery(request, trx, query);

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
                if (this.hasEntityVersionInfo()) {
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
    request: ISessionRequest,
    query: IQuery
  ): Promise<QueryResult<T>> {
    return using(new XLog(CoreService.logger, levels.INFO, 'query', `[${this.tableName}]`), (log) => {
      let knexQuery = this.fromTable();

      const visitor = new KnexQueryVisitor(knexQuery, this.metadata);
      query.term.accept(visitor);

      return this.queryKnex(request, visitor.query(knexQuery));
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

  public get metadata(): TableMetadata {
    return this._metadata;
  }

  protected get knexService(): KnexService {
    return this._knexService;
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

    using(new XLog(CoreService.logger, levels.INFO, 'findEntityVersionAndResolve'), (log) => {

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

    return using(new XLog(CoreService.logger, levels.INFO, 'addColumnSelector',
      `columnName = ${columnName}, value = ${value}`), (log) => {
        return qb
          .andWhere(columnName, value)
          .transacting(trx);
      });
  }



  /**
   * Liefert eine Knex-Query, die für die aktuelle Tabelle alle Rows liefert.
   * Ist @param{session} vorhanden und eine ClientColumn definiert, werden nur die Rows mit der
   * ClientId des Users der Session geliefert
   *
   * @protected
   * @param {ISessionRequest|IBodyRequest<IUser>} request
   * @param {Knex.Transaction} trx
   * @returns {Knex.QueryBuilder}
   *
   * @memberof ReadonlyService
   */
  protected createClientSelectorQuery(request: ISessionRequest | IBodyRequest<IUser>, trx: Knex.Transaction,
    query?: Knex.QueryBuilder): Knex.QueryBuilder {

    if (!query) {
      query = this.fromTable();
    }

    if (request && this.metadata.clientColumn) {
      const userColumnSelector = `${this._userMetadata.clientColumn.options.name}`;
      let userIdValue;


      //
      // beim Login-Request wir ein rudimentäres User-Objekt übergeben und liegt
      // als body vor; bei allen anderen Requests existiert ein aktueller User, der in
      // der Property user vorliegt.
      //
      if (request.body !== null && request.body instanceof User) {
        userIdValue = request.body.id_client;
      } else {
        userIdValue = request.user.id_client;
      }

      query = query
        .andWhere(userColumnSelector, userIdValue);
    }

    return query
      .transacting(trx);
  }


  /**
   * Liefert true, falls für das aktuelle Model EntityVersion-Information aktualisiert wird und die letzte Version
   * geliefert werden kann.
   *
   * @private
   * @returns {boolean}
   *
   * @memberof ReadonlyService
   */
  protected hasEntityVersionInfo(): boolean {
    return (this.entityVersionMetadata && this.entityVersionMetadata !== this.metadata &&
      !this.metadata.options.isView);
  }
}