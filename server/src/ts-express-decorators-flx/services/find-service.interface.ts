import * as Knex from 'knex';

// Fluxgate
import { FindByIdServiceResult, FindServiceResult, QueryServiceResult } from '@fluxgate/common';
import { IQuery, IToString } from '@fluxgate/core';


/**
 * Interface für lesende CRUD-Operationen auf der DB über knex.
 *
 * @export
 * @abstract
 * @class ServiceBase
 * @template T
 * @template TId
 */
export interface IFindService<T, TId extends IToString> {

  /**
   * Liefert oder setzt den DB-Id-Spaltennamen (primary key column)
   *
   * @readonly
   * @type {string}
   * @memberOf ServiceBase
   */
  idColumnName: string;

  /**
   * Liefert eine Entity-Instanz vom Typ {T} aus der DB als @see{Promise}
   *
   * @param {TId} id
   * @returns {Promise<T>}
   *
   * @memberOf ServiceBase
   */
  findById(
    id: TId
  ): Promise<FindByIdServiceResult<T, TId>>;


  /**
   * Liefert alle Entity-Instanzen vom Typ {T} als @see{Promise}
   *
   * @returns {Promise<T[]>}
   *
   * @memberOf ServiceBase
   */
  find(
  ): Promise<FindServiceResult<T>>;


  /**
   * Führt die Query {query} aus und liefert ein Array von Entity-Instanzen vom Typ {T} als @see{Promise}
   *
   * @param {Knex.QueryBuilder} query
   * @returns {Promise<T[]>}
   *
   * @memberOf ServiceBase
   */
  queryKnex(
    query: Knex.QueryBuilder
  ): Promise<QueryServiceResult<T>>;


  query(
    query: IQuery
  ): Promise<QueryServiceResult<T>>;


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