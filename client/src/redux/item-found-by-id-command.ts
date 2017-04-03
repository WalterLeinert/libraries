// fluxgate
import { IEntity } from '@fluxgate/common';

import { ServiceCommand } from './service-command';
import { ServiceRequestStates } from './service-request-state';
import { IServiceState } from './service-state.interface';

/**
 *
 * Kommando nach Finden eines Items über die Id über einen Rest-Service.
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
export class ItemFoundByIdCommand<T extends IEntity<TId>, TId> extends ServiceCommand<T, TId> {

  constructor(storeId: string, private item: T) {
    super(storeId);
  }

  /**
   * Liefert einen neuen Status für die aktuelle Operation und den aktuellen Status
   *
   * @param {IServiceState<T, TId>} state
   * @returns {IServiceState<T, TId>}
   */
  public execute(state: IServiceState<T, TId>): IServiceState<T, TId> {
    return {
      ...state,
      item: this.item,
      state: ServiceRequestStates.DONE,
      error: undefined
    };
  }
}