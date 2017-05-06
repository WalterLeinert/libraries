import { IEntity } from '../../model/entity.interface';

import { ICrudServiceState } from '../state/crud-service-state.interface';
import { ServiceRequestStates } from '../state/service-request-state';
import { IServiceRequests } from './../service-requests';
import { ServiceCommand } from './service-command';


/**
 * async Kommando zum Erzeugen eines neuen Items über einen Rest-Service.
 *
 * Der eigentliche Erzeugen wird im zugehörigen ServiceRequest ausgeführt,
 * wo ein dispatch dieses Kommandos erfolgt.
 *
 * @export
 * @class CreatingItemCommand
 * @extends {ServiceCommand<T, TId>}
 * @template T
 * @template TId
 */
export class CreatingItemCommand<T extends IEntity<TId>, TId> extends ServiceCommand<T> {

  constructor(serviceRequests: IServiceRequests, private item: T) {
    super(serviceRequests);
  }


  /**
   * Liefert einen neuen Status für die aktuelle Operation und den aktuellen Status
   *
   * @param {IServiceState} state
   * @returns {IServiceState}
   *
   */
  protected updateState(state: ICrudServiceState<T, TId>): ICrudServiceState<T, TId> {
    return {
      ...state,
      items: [...state.items],
      state: ServiceRequestStates.RUNNING,
      error: undefined
    };
  }
}