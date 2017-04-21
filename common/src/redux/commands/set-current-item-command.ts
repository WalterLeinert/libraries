import { IEntity } from '../../model/entity.interface';

import { IServiceState } from '../service-state.interface';
import { ServiceCommand } from './service-command';


/**
 * Kommando zum Setzen eines aktuellen Items (z.B. nach Selektion in einer Liste).
 *
 * Das eigentliche Setzen des Items wird im zugehörigen ServiceRequest ausgeführt.
 *
 * @export
 * @class SetCurrentItemCommand
 * @extends {ServiceCommand<T, TId>}
 * @template T
 * @template TId
 */
export class SetCurrentItemCommand<T extends IEntity<TId>, TId> extends ServiceCommand<T, TId> {

  constructor(storeId: string, private item: T) {
    super(storeId);
  }

  /**
   * Liefert einen neuen Status für die aktuelle Operation und den aktuellen Status
   *
   * @param {IServiceState<T, TId>} state
   * @returns {IServiceState<T, TId>}
   *
   * @memberOf SetCurrentItemCommand
   */
  public execute(state: IServiceState<T, TId>): IServiceState<T, TId> {
    const item: T = this.item;
    return {
      ...state,
      items: [...state.items],
      currentItem: item,
      error: undefined
    };
  }
}