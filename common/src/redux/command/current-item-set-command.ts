import { IEntity } from '../../model/entity.interface';

import { ICurrentItemServiceState } from '../state/current-item-service-state.interface';
import { ServiceRequestStates } from '../state/service-request-state';
import { IServiceRequests } from './../service-requests';
import { ServiceCommand } from './service-command';


/**
 * Kommando zum Setzen eines aktuellen Items (z.B. nach Selektion in einer Liste).
 *
 * Das eigentliche Setzen des Items wird im zugehörigen ServiceRequest ausgeführt.
 *
 * @export
 * @class SetCurrentItemCommand
 * @extends {ServiceCommand<T, TId>}
 * @template T
 * @template TId
 */
export class CurrentItemSetCommand<T extends IEntity<TId>, TId> extends ServiceCommand<T> {

  constructor(serviceRequests: IServiceRequests, private item: T) {
    super(serviceRequests);
  }

  /**
   * Liefert einen neuen Status für die aktuelle Operation und den aktuellen Status
   *
   * @param {IServiceState<T, TId>} state
   * @returns {IServiceState<T, TId>}
   *
   * @memberOf SetCurrentItemCommand
   */
  protected updateState(state: ICurrentItemServiceState<T, TId>): ICurrentItemServiceState<T, TId> {
    const item: T = this.item;
    return {
      ...state,
      currentItem: item,
      state: ServiceRequestStates.DONE,
      error: undefined
    };
  }
}