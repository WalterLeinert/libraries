import * as Knex from 'knex';

// Fluxgate
import { ServiceResult } from '@fluxgate/common';
import { IQuery, IToString } from '@fluxgate/core';


/**
 * Interface wie IBaseService, allerdings mit any-Typen
 *
 * @export
 * @interface IBaseServiceRaw
 * @extends {IBaseService<any, any>}
 */
export interface IBaseServiceRaw extends IBaseService<any, any> {

}


/**
 * Interface für CRUD-Operationen auf der DB über knex.
 *
 * @export
 * @abstract
 * @class ServiceBase
 * @template T
 * @template TId
 */
export interface IBaseService<T, TId extends IToString> {

  /**
   * Liefert oder setzt den DB-Id-Spaltennamen (primary key column)
   *
   * @readonly
   * @type {string}
   * @memberOf ServiceBase
   */
  idColumnName: string;


  /**
   * Erzeugt eine neue Entity-Instanz vom Typ {T} in der DB und liefert die Instanz als @see{Promise}
   *
   * @param {T} subject
   * @returns {Promise<T>}
   *
   * @memberOf ServiceBase
   */
  create(
    subject: T
  ): Promise<T>;


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
  ): Promise<T>;


  /**
   * Liefert alle Entity-Instanzen vom Typ {T} als @see{Promise}
   *
   * @returns {Promise<T[]>}
   *
   * @memberOf ServiceBase
   */
  find(
  ): Promise<T[]>;


  /**
   * Aktualisiert die Entity-Instanz {subject} vom Typ {T} in der DB und liefert die Instanz als @see{Promise}
   *
   * @param {T} subject
   * @returns {Promise<T>}
   *
   * @memberOf ServiceBase
   */
  update(
    subject: T
  ): Promise<T>;


  /**
   * Löscht eine Entity-Instanz vom Typ {T} in der DB und liefert die {Id} als @see{Promise}
   *
   * @param {TId} id
   * @returns {Promise<TId>}
   *
   * @memberOf ServiceBase
   */
  delete(
    id: TId
  ): Promise<ServiceResult<TId>>;


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
  ): Promise<T[]>;


  query(
    query: IQuery
  ): Promise<T[]>;


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