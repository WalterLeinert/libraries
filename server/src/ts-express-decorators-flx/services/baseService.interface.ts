import * as Knex from 'knex';

// Fluxgate
import {
  CreateResult, DeleteResult, IEntity, UpdateResult
} from '@fluxgate/common';
import { IToString } from '@fluxgate/core';

import { ISessionRequest } from '../session/session-request.interface';
import { IReadonlyService } from './readonly-service.interface';


/**
 * Interface wie IBaseService, allerdings mit any-Typen
 *
 * @export
 * @interface IBaseServiceRaw
 * @extends {IBaseService<any, any>}
 */
// tslint:disable-next-line:no-empty-interface
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
export interface IBaseService<T extends IEntity<TId>, TId extends IToString> extends IReadonlyService<T, TId> {

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
    request: ISessionRequest,
    subject: T,
    trxExisting?: Knex.Transaction
  ): Promise<CreateResult<T, TId>>;


  /**
   * Aktualisiert die Entity-Instanz {subject} vom Typ {T} in der DB und liefert die Instanz als @see{Promise}
   *
   * @param {T} subject
   * @returns {Promise<T>}
   *
   * @memberOf ServiceBase
   */
  update(
    request: ISessionRequest,
    subject: T,
    trxExisting?: Knex.Transaction
  ): Promise<UpdateResult<T, TId>>;


  /**
   * Löscht eine Entity-Instanz vom Typ {T} in der DB und liefert die {Id} als @see{Promise}
   *
   * @param {TId} id
   * @returns {Promise<TId>}
   *
   * @memberOf ServiceBase
   */
  delete(
    request: ISessionRequest,
    id: TId,
    trxExisting?: Knex.Transaction
  ): Promise<DeleteResult<TId>>;

}