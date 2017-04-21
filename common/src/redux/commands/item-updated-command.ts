import { IEntity } from '../../model/entity.interface';

import { ServiceRequestStates } from '../service-request-state';
import { IServiceState } from '../service-state.interface';
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
  public execute(state: IServiceState<T, TId>): IServiceState<T, TId> {
    return {
      ...state,
      items: state.items.map((item) => item.id !== this.item.id ? item : this.item),
      item: this.item,
      state: ServiceRequestStates.DONE,
      error: undefined
    };
  }
}