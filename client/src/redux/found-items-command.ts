// fluxgate
import { IEntity } from '@fluxgate/common';

import { ServiceCommand } from './service-command';
import { ServiceRequestStates } from './service-request-state';
import { IServiceState } from './service-state.interface';


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
export class FoundItemsCommand<T extends IEntity<TId>, TId> extends ServiceCommand<T, TId> {

  constructor(storeId: string, private items: T[]) {
    super(storeId);
  }

  /**
   * Liefert einen neuen Status für die aktuelle Operation und den aktuellen Status
   *
   * @param {IServiceState<T, TId>} state
   * @returns {IServiceState<T, TId>}
   *
   * @memberOf FindItemsCommand
   */
  public execute(state: IServiceState<T, TId>): IServiceState<T, TId> {
    return {
      ...state,
      items: this.items,
      state: ServiceRequestStates.DONE,
      error: undefined
    };
  }
}