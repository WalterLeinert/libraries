import { ServiceCommand } from './service-command';
import { ServiceRequestStates } from './service-request-state';
import { IServiceState } from './service-state.interface';


/**
 * async Kommando zum Update eines Items über einen Rest-Service.
 *
 * Der eigentliche Update wird im zugehörigen ServiceRequest ausgeführt,
 * wo ein dispatch dieses Kommandos erfolgt.
 *
 * @export
 * @class UpdatingItemCommand
 * @extends {ServiceCommand<T, TId>}
 * @template T
 * @template TId
 */
export class UpdatingItemCommand<T, TId> extends ServiceCommand<T, TId> {

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
      state: ServiceRequestStates.RUNNING,
      error: undefined
    };
  }
}