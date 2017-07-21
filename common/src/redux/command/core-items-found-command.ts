import { ICoreServiceState } from '../state/core-service-state.interface';
import { ServiceRequestStates } from '../state/service-request-state';
import { IServiceRequests } from './../service-requests';
import { ServiceCommand } from './service-command';


/**
 * Kommando zum Finden/Liefern von Items über einen Rest-Service.
 *
 * Das eigentliche Finden von Items wird im zugehörigen ServiceRequest ausgeführt,
 * wo ein dispatch dieses Kommandos erfolgt.
 *
 * @export
 * @class FindItemsCommand
 * @extends {ServiceCommand<T, TId>}
 * @template T
 * @template TId
 */
export class CoreItemsFoundCommand<T> extends ServiceCommand<T> {

  constructor(serviceRequests: IServiceRequests, private items: T[], fromCache: boolean) {
    super(serviceRequests, fromCache);
  }

  public hasModifiedItems(): boolean {
    return true;
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
      items: [...this.items],
      state: ServiceRequestStates.DONE,
      error: undefined
    };
  }

}