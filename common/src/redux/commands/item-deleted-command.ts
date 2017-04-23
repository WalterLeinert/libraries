import { IEntity } from '../../model/entity.interface';

import { ServiceRequestStates } from '../service-request-state';
import { IServiceState } from '../service-state.interface';
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
export class ItemDeletedCommand<T extends IEntity<TId>, TId> extends ServiceCommand<T, TId> {

  constructor(storeId: string, private id: TId) {
    super(storeId);
  }

  /**
   * Liefert einen neuen Status für die aktuelle Operation und den aktuellen Status
   *
   * @param {IServiceState<T, TId>} state
   * @returns {IServiceState<T, TId>}
   *
   * @memberOf DeleteItemCommand
   */
  public execute(state: IServiceState<T, TId>): IServiceState<T, TId> {
    return {
      ...state,
      items: state.items.filter((item) => item.id !== this.id),
      deletedId: this.id,
      currentItem: (state.currentItem && state.currentItem.id === this.id) ? null : state.currentItem,
      item: (state.item && state.item.id === this.id) ? null : state.item,
      state: ServiceRequestStates.DONE,
      error: undefined
    };
  }

  public hasModifiedItems(): boolean {
    return true;
  }
}