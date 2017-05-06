import { IEntity } from '../../model/entity.interface';

import { ICrudServiceState } from '../state/crud-service-state.interface';
import { ServiceRequestStates } from '../state/service-request-state';
import { IServiceRequests } from './../service-requests';
import { ServiceCommand } from './service-command';

/**
 * Kommando nach Löschen von Items über einen Rest-Service.
 *
 * Das eigentliche Löschen wird im zugehörigen ServiceRequest ausgeführt,
 * wo ein dispatch dieses Kommandos erfolgt.
 *
 * @export
 * @class DeletedItemCommand
 * @extends {ServiceCommand<T, TId>}
 * @template T
 * @template TId
 */
export class ItemDeletedCommand<T extends IEntity<TId>, TId> extends ServiceCommand<T> {

  constructor(serviceRequests: IServiceRequests, public id: TId) {
    super(serviceRequests);
  }

  public hasModifiedItems(): boolean {
    return true;
  }

  /**
   * Liefert einen neuen Status für die aktuelle Operation und den aktuellen Status
   *
   * @param {IServiceState<T, TId>} state
   * @returns {IServiceState<T, TId>}
   *
   * @memberOf DeleteItemCommand
   */
  protected updateState(state: ICrudServiceState<T, TId>): ICrudServiceState<T, TId> {
    return {
      ...state,
      items: state.items.filter((item) => item.id !== this.id),
      deletedId: this.id,
      item: (state.item && state.item.id === this.id) ? null : state.item,
      state: ServiceRequestStates.DONE,
      error: undefined
    };
  }
}