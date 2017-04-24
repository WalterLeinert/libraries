import { IEntity } from '../../model/entity.interface';

import { ICrudServiceState } from '../state/crud-service-state.interface';
import { ServiceRequestStates } from '../state/service-request-state';
import { ServiceCommand } from './service-command';


/**
 * Kommando zum Update eines Items über einen Rest-Service.
 *
 * Der eigentliche Update wird im zugehörigen ServiceRequest ausgeführt,
 * wo ein dispatch dieses Kommandos erfolgt.
 *
 * @export
 * @class UpdateItemCommand
 * @extends {ServiceCommand<T, TId>}
 * @template T
 * @template TId
 */
export class ItemUpdatedCommand<T extends IEntity<TId>, TId> extends ServiceCommand<T, TId> {

  constructor(storeId: string, private item: T) {
    super(storeId);
  }


  /**
   * Liefert einen neuen Status für die aktuelle Operation und den aktuellen Status
   *
   * @param {IServiceState<T, TId>} state
   * @returns {IServiceState<T, TId>}
   *
   * @memberOf UpdateItemCommand
   */
  public execute(state: ICrudServiceState<T, TId>): ICrudServiceState<T, TId> {
    return {
      ...state,
      items: state.items.map((item) => item.id !== this.item.id ? item : this.item),
      item: this.item,
      // TODO currentItem: (state.currentItem && state.currentItem.id === this.item.id) ? this.item : state.currentItem,
      state: ServiceRequestStates.DONE,
      error: undefined
    };
  }

  public hasModifiedItems(): boolean {
    return true;
  }
}