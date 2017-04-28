import { IEntity } from '../../model/entity.interface';

import { ICrudServiceState } from '../state/crud-service-state.interface';
import { ServiceRequestStates } from '../state/service-request-state';
import { IServiceRequests } from './../service-requests';
import { ServiceCommand } from './service-command';


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
export class ItemsFoundCommand<T extends IEntity<TId>, TId> extends ServiceCommand<T, TId> {

  constructor(serviceRequests: IServiceRequests, private items: T[]) {
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
   * @memberOf FindItemsCommand
   */
  protected updateState(state: ICrudServiceState<T, TId>): ICrudServiceState<T, TId> {
    return {
      ...state,
      items: [...this.items],
      state: ServiceRequestStates.DONE,
      error: undefined
    };
  }

}