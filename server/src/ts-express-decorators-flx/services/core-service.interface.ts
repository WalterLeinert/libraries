import * as Knex from 'knex';

// Fluxgate
import { FindResult, QueryResult } from '@fluxgate/common';
import { IQuery, IToString } from '@fluxgate/core';
import { ISessionRequest } from '../session/session-request.interface';

/**
 * Interface für REST-Services, die auf Entities ohne Id arbeiten (z.B. DB-Views)
 *
 * @export
 * @abstract
 * @class ServiceBase
 * @template T
 * @template TId
 */
export interface ICoreService<T, TId extends IToString> {

  /**
   * Liefert alle Entity-Instanzen vom Typ {T} als @see{Promise}
   *
   * @returns {Promise<T[]>}
   *
   * @memberOf ServiceBase
   */
  find(
    request: ISessionRequest
  ): Promise<FindResult<T>>;


  /**
   * Führt die Query {query} aus und liefert ein Array von Entity-Instanzen vom Typ {T} als @see{Promise}
   *
   * @param {Knex.QueryBuilder} query
   * @returns {Promise<T[]>}
   *
   * @memberOf ServiceBase
   */
  queryKnex(
    request: ISessionRequest,
    query: Knex.QueryBuilder
  ): Promise<QueryResult<T>>;


  query(
    request: ISessionRequest,
    query: IQuery
  ): Promise<QueryResult<T>>;


  /**
   * Liefert die from(<table>) Clause für den aktuellen Tabellennamen
   *
   * @readonly
   * @protected
   * @type {Knex.QueryBuilder}
   * @memberOf ServiceBase
   */
  fromTable(): Knex.QueryBuilder;
}