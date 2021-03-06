import { IException } from '@fluxgate/core';

import { ServiceRequestStates } from '../state/service-request-state';
import { IServiceState } from '../state/service-state.interface';
import { IServiceRequests } from './../service-requests';
import { ServiceCommand } from './service-command';


/**
 * Kommando zum Ablegen einer Exception nach einem Fehler bei einem Rest-Servicecall.
 *
 * @export
 * @class ErrorCommand
 * @extends {ServiceCommand<T, TId>}
 * @template T
 * @template TId
 */
export class ErrorCommand<T> extends ServiceCommand<T> {

  constructor(serviceRequests: IServiceRequests, private error: IException) {
    super(serviceRequests, false);
  }


  /**
   * Liefert einen neuen Status für die aktuelle Operation und den aktuellen Status
   *
   * @param {IServiceState} state
   * @returns {IServiceState}
   *
   */
  protected updateState(state: IServiceState): IServiceState {
    return {
      ...state,
      state: ServiceRequestStates.ERROR,
      error: this.error
    };
  }
}