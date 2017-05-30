// Fluxgate
import { FindByIdResult, IEntity } from '@fluxgate/common';
import { IException, IToString } from '@fluxgate/core';

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
export interface IServiceCore {

  /**
   * Liefert eine BusinessException für den angegebenen Fehler @param{error}.
   *
   * @protected
   * @param {(string | IException | Error)} error
   * @returns {IException}
   *
   * @memberof ServiceCore
   */
  createBusinessException(error: string | IException | Error): IException;


  /**
   * Liefert eine SystemException für den angegebenen Fehler @param{error}.
   *
   * @protected
   * @param {(string | IException | Error)} error
   * @returns {IException}
   *
   * @memberof ServiceCore
   */
  createSystemException(error: string | IException | Error): IException;

}