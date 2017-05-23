// Fluxgate
import { FindByIdResult, IEntity } from '@fluxgate/common';
import { IToString } from '@fluxgate/core';

import { ISessionRequest } from '../session/session-request.interface';
import { ICoreService } from './core-service.interface';

/**
 * Interface für lesende CRUD-Operationen auf der DB über knex.
 *
 * @export
 * @abstract
 * @class ServiceBase
 * @template T
 * @template TId
 */
export interface IReadonlyService<T extends IEntity<TId>, TId extends IToString> extends ICoreService<T, TId> {

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
    request: ISessionRequest,
    id: TId
  ): Promise<FindByIdResult<T, TId>>;

}