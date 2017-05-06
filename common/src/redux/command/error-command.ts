import { IException } from '@fluxgate/core';

import { IEntity } from '../../model/entity.interface';

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
export class ErrorCommand<T extends IEntity<TId>, TId> extends ServiceCommand<T> {

  constructor(serviceRequests: IServiceRequests, private error: IException) {
    super(serviceRequests);
  }


  /**
   * Liefert einen neuen Status für die aktuelle Operation und den aktuellen Status
   *
   * @param {IServiceState<T, TId>} state
   * @returns {IServiceState<T, TId>}
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