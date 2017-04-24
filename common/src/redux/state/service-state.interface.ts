import { IException } from '@fluxgate/core';

import { ServiceRequestState } from './service-request-state';

/**
 * Basis-Interface für den Service-Status aller ServiceRequests
 *
 * @export
 * @interface IServiceState
 * @template T
 * @template TId
 */
export interface IServiceState {

  /**
   * Der Status des zugehörigen Servicerequests.
   * Falls der Status @see{ServiceRequestStates.ERROR} ist, findet man in @see{error} die Details
   *
   * @type {ServiceRequestState}
   * @memberOf IServiceState
   */
  state: ServiceRequestState;

  /**
   * Falls bei einem Servicecall ein Fehler aufgetreten ist, enthält error die ensprechende Exception
   *
   * @type {IException}
   * @memberOf IServiceState
   */
  error: IException;
}