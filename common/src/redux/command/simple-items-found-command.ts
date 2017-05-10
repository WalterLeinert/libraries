
import { ServiceRequestStates } from '../state/service-request-state';
import { ISimpleServiceState } from '../state/simple-service-state.interface';
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
export class SimpleItemsFoundCommand<T> extends ServiceCommand<T> {

  constructor(serviceRequests: IServiceRequests, private items: T[]) {
    super(serviceRequests);
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
  protected updateState(state: ISimpleServiceState<T>): ISimpleServiceState<T> {
    return {
      ...state,
      items: [...this.items],
      state: ServiceRequestStates.DONE,
      error: undefined
    };
  }

}