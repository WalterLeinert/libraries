import { IEntity } from '../../model/entity.interface';

import { ICrudServiceState } from '../state/crud-service-state.interface';
import { ServiceRequestStates } from '../state/service-request-state';
import { ServiceCommand } from './service-command';

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
  public execute(state: ICrudServiceState<T, TId>): ICrudServiceState<T, TId> {
    return {
      ...state,
      items: [...state.items],
      state: ServiceRequestStates.RUNNING,
      error: undefined
    };
  }
}