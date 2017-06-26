import * as Knex from 'knex';

// -------------------------- logging -------------------------------
// tslint:disable-next-line:no-unused-variable
import { getLogger, ILogger, levels, using, XLog } from '@fluxgate/platform';
// -------------------------- logging -------------------------------


// Fluxgate
import {
  CreateResult, DeleteResult, ExceptionWrapper, FindByIdResult, FindResult,
  IEntity, IStatusQuery, QueryResult, StatusFilter, TableMetadata, UpdateResult
} from '@fluxgate/common';
import {
  Assert, Funktion, IException, IToString
} from '@fluxgate/core';

import { ISessionRequest } from '../session/session-request.interface';
import { IBaseService } from './baseService.interface';


/**
 * Abstrakte Basisklasse die einen Proxy zu einem Service (@see{IBaseService}) implementiert.
 *
 * @export
 * @abstract
 * @class ServiceProxy
 * @implements {IBaseService<T, TId>}
 * @template T
 * @template TId
 */
export abstract class ServiceProxy<T extends IEntity<TId>, TId extends IToString> implements IBaseService<T, TId>  {
  protected static logger = getLogger(ServiceProxy);

  protected constructor(private _service: IBaseService<T, TId>) {
    Assert.notNull(_service);
    using(new XLog(ServiceProxy.logger, levels.INFO, 'ctor'), (log) => {
      //
    });
  }



  /**
   * Liefert alle Entity-Instanzen vom Typ {T} als @see{Promise}
   *
   * @returns {Promise<T[]>}
   */
  public find(
    request: ISessionRequest,
    filter?: StatusFilter
  ): Promise<FindResult<T>> {
    return this._service.find(request, filter);
  }



  /**
   * Führt die Query {query} aus und liefert ein Array von Entity-Instanzen vom Typ {T} als @see{Promise}
   *
   * @param {Knex.QueryBuilder} query
   * @returns {Promise<T[]>}
   */
  public queryKnex(
    request: ISessionRequest,
    query: Knex.QueryBuilder,
    filter?: StatusFilter
  ): Promise<QueryResult<T>> {
    return this._service.queryKnex(request, query, filter);
  }


  public query(
    request: ISessionRequest,
    query: IStatusQuery
  ): Promise<QueryResult<T>> {
    return this._service.query(request, query);
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
  public fromTable(table?: string | Funktion): Knex.QueryBuilder {
    return this._service.fromTable(table);
  }

  public get tableName(): string {
    return this._service.tableName;
  }

  public get metadata(): TableMetadata {
    return this._service.metadata;
  }


  /**
   * Erzeugt eine neue Entity-Instanz vom Typ {T} in der DB und liefert die Instanz als @see{Promise}
   *
   * @param {T} subject
   * @returns {Promise<T>}
   */
  public create(
    request: ISessionRequest,
    subject: T
  ): Promise<CreateResult<T, TId>> {
    return this._service.create(request, subject);
  }


  /**
   * Aktualisiert die Entity-Instanz {subject} vom Typ {T} in der DB und liefert die Instanz als @see{Promise}
   *
   * @param {T} subject
   * @returns {Promise<T>}
   */
  public update(
    request: ISessionRequest,
    subject: T
  ): Promise<UpdateResult<T, TId>> {
    return this._service.update(request, subject);
  }



  /**
   * Löscht eine Entity-Instanz vom Typ {T} in der DB und liefert die {Id} als @see{Promise}
   *
   * @param {TId} id
   * @returns {Promise<TId>}
   */
  public delete(
    request: ISessionRequest,
    id: TId
  ): Promise<DeleteResult<TId>> {
    return this._service.delete(request, id);
  }


  /**
   * Liefert eine Entity-Instanz vom Typ {T} aus der DB als @see{Promise}
   *
   * @param {TId} id
   * @returns {Promise<T>}
   */
  public findById(
    request: ISessionRequest,
    id: TId
  ): Promise<FindByIdResult<T, TId>> {
    return this._service.findById(request, id);
  }



  /**
   * Liefert den DB-Id-Spaltennamen (primary key column)
   *
   * @readonly
   * @type {string}
   */
  public get idColumnName(): string {
    return this._service.idColumnName;
  }


  /**
   * Setzt die "primary key" Spalte von "aussen". Diese wird als PK-Spalte verwendet, falls über die Metadaten
   * keine primaryKeyColumn definiert ist (kommt aus dem Controller).
   *
   * @param {string} name
   */
  public set idColumnName(name: string) {
    this._service.idColumnName = name;
  }


  /**
   * Liefert eine BusinessException für den angegebenen Fehler @param{error}.
   *
   * @protected
   * @param {(string | IException | Error)} error
   * @returns {IException}
   */
  public createBusinessException(error: string | IException | Error): IException {
    return ExceptionWrapper.createBusinessException(error);
  }

  /**
   * Liefert eine SystemException für den angegebenen Fehler @param{error}.
   *
   * @protected
   * @param {(string | IException | Error)} error
   * @returns {IException}
   */
  public createSystemException(error: string | IException | Error): IException {
    return this._service.createSystemException(error);
  }
}