import { IEntity } from '../model/entity.interface';

import { ServiceCommand } from './service-command';
import { ServiceRequestStates } from './service-request-state';
import { IServiceState } from './service-state.interface';

/**
 * async Kommando zum Finden eines Items über die Id über einen Rest-Service.
 *
 * Das eigentliche Finden wird im zugehörigen ServiceRequest ausgeführt,
 * wo ein dispatch dieses Kommandos erfolgt.
 *
 * @export
 * @class FindingItemByIdCommand
 * @extends {ServiceCommand<T, TId>}
 * @template T
 * @template TId
 */
export class FindingItemByIdCommand<T extends IEntity<TId>, TId> extends ServiceCommand<T, TId> {

  constructor(storeId: string, private id: TId) {
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
      items: [...state.items],
      state: ServiceRequestStates.RUNNING,
      error: undefined
    };
  }
}