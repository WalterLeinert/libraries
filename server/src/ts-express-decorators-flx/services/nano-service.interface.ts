

// Fluxgate
import { FindResult } from '@fluxgate/common';
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
export interface INanoService<T> {


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




}