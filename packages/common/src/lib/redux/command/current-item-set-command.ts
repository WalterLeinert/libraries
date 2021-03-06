import { ICurrentItemServiceState } from '../state/current-item-service-state.interface';
import { ServiceRequestStates } from '../state/service-request-state';
import { IServiceRequests } from './../service-requests';
import { CurrentItemCommand } from './current-item-command';


/**
 * Kommando zum Setzen eines aktuellen Items (z.B. nach Selektion in einer Liste).
 *
 * Das eigentliche Setzen des Items wird im zugehörigen ServiceRequest ausgeführt.
 *
 * @export
 * @class SetCurrentItemCommand
 * @extends {CurrentItemCommand<T>}
 * @template T
 * @template TId
 */
export class CurrentItemSetCommand<T> extends CurrentItemCommand<T> {

  constructor(serviceRequests: IServiceRequests, item: T) {
    super(serviceRequests, item);
  }

  /**
   * Liefert einen neuen Status für die aktuelle Operation und den aktuellen Status
   *
   * @param {IServiceState} state
   * @returns {IServiceState}
   *
   * @memberOf SetCurrentItemCommand
   */
  protected updateState(state: ICurrentItemServiceState<T>): ICurrentItemServiceState<T> {
    const item: T = this.item;
    return {
      ...state,
      currentItem: item,
      state: ServiceRequestStates.DONE,
      error: undefined
    };
  }
}