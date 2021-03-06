import { ICrudServiceState } from '../state/crud-service-state.interface';
import { ServiceRequestStates } from '../state/service-request-state';
import { IServiceRequests } from './../service-requests';
import { ServiceCommand } from './service-command';


/**
 * Kommando nach erfolgreicher Suche von Items (mittes Query) über einen Rest-Service.
 *
 * Die eigentliche Query wurde im zugehörigen ServiceRequest ausgeführt,
 * wo ein dispatch dieses Kommandos erfolgt.
 *
 * @export
 * @class ItemsQueriedCommand
 * @extends {ServiceCommand<T, TId>}
 * @template T
 * @template TId
 */
export class ItemsQueriedCommand<T, TId> extends ServiceCommand<T> {

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
  protected updateState(state: ICrudServiceState<T, TId>): ICrudServiceState<T, TId> {
    return {
      ...state,
      items: [...this.items],           // TODO ggf. itemsQueried?
      state: ServiceRequestStates.DONE,
      error: undefined
    };
  }

}