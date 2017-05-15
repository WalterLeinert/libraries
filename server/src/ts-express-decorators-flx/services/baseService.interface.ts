// Fluxgate
import {
  CreateResult, DeleteResult, UpdateResult
} from '@fluxgate/common';
import { IToString } from '@fluxgate/core';

import { IFindService } from './find-service.interface';

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
export interface IBaseService<T, TId extends IToString> extends IFindService<T, TId> {

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
  ): Promise<CreateResult<T>>;


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
  ): Promise<UpdateResult<T>>;


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
  ): Promise<DeleteResult<TId>>;

}