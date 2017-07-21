import { ICoreServiceState } from '../state/core-service-state.interface';
import { ServiceRequestStates } from '../state/service-request-state';
import { IServiceRequests } from './../service-requests';
import { ServiceCommand } from './service-command';


/**
 * async Kommando zum Finden/Liefern von Items über einen Rest-Service.
 *
 * Das eigentliche Finden von Items wird im zugehörigen ServiceRequest ausgeführt,
 * wo ein dispatch dieses Kommandos erfolgt.
 *
 * @export
 * @class FindingItemsCommand
 * @extends {ServiceCommand<T, TId>}
 * @template T
 * @template TId
 */
export class FindingItemsCommand<T, TId> extends ServiceCommand<T> {

  constructor(serviceRequests: IServiceRequests) {
    super(serviceRequests, false);
  }

  /**
   * Liefert einen neuen Status für die aktuelle Operation und den aktuellen Status
   *
   * @param {IServiceState} state
   * @returns {IServiceState}
   *
   * @memberOf FindItemsCommand
   */
  protected updateState(state: ICoreServiceState<T>): ICoreServiceState<T> {
    return {
      ...state,
      items: [...state.items],
      state: ServiceRequestStates.RUNNING,
      error: undefined
    };
  }
}