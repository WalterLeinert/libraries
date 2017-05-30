// Fluxgate
import { ExceptionWrapper } from '@fluxgate/common';
import { IException } from '@fluxgate/core';


/**
 * Abstrakte Basisklasse für alle REST-Services
 *
 * @export
 * @abstract
 * @class ServiceCore
 * @template T
 */
export abstract class ServiceCore {

  /**
   * Liefert eine BusinessException für den angegebenen Fehler @param{error}.
   *
   * @protected
   * @param {(string | IException | Error)} error
   * @returns {IException}
   *
   * @memberof ServiceCore
   */
  protected createBusinessException(error: string | IException | Error): IException {
    return ExceptionWrapper.createBusinessException(error);
  }

  /**
   * Liefert eine SystemException für den angegebenen Fehler @param{error}.
   *
   * @protected
   * @param {(string | IException | Error)} error
   * @returns {IException}
   *
   * @memberof ServiceCore
   */
  protected createSystemException(error: string | IException | Error): IException {
    return ExceptionWrapper.createSystemException(error);
  }

}