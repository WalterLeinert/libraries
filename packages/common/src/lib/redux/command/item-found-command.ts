import { IEntity } from '../../model/entity.interface';

import { ICrudServiceState } from '../state/crud-service-state.interface';
import { ServiceRequestStates } from '../state/service-request-state';
import { IServiceRequests } from './../service-requests';
import { ServiceCommand } from './service-command';

/**
 *
 * Kommando nach Finden eines Items über einen Rest-Service.
 *
 * Das eigentliche Finden wird im zugehörigen ServiceRequest ausgeführt,
 * wo ein dispatch dieses Kommandos erfolgt.
 *
 * @export
 * @class FoundItemCommand
 * @extends {ServiceCommand<T, TId>}
 * @template T
 * @template TId
 */
export class ItemFoundCommand<T extends IEntity<TId>, TId> extends ServiceCommand<T> {

  constructor(serviceRequests: IServiceRequests, private item: T, fromCache: boolean) {
    super(serviceRequests, fromCache);
  }

  /**
   * Liefert einen neuen Status für die aktuelle Operation und den aktuellen Status
   *
   * @param {IServiceState} state
   * @returns {IServiceState}
   */
  protected updateState(state: ICrudServiceState<T, TId>): ICrudServiceState<T, TId> {
    return {
      ...state,
      items: [...state.items],
      item: this.item,
      state: ServiceRequestStates.DONE,
      error: undefined
    };
  }
}