import { IEntity } from '../model/entity.interface';

import { ICommand } from './command.interface';
import { ServiceRequestStates } from './service-request-state';
import { IServiceState } from './service-state.interface';


/**
 * abstraktes Command, welches Service-Operationen (wie find, update) ausführt und auf einem Status
 * @see{IServiceState} arbeitet.
 *
 * @export
 * @abstract
 * @class ServiceCommand
 * @implements {ICommand<IServiceState<T>>}
 * @template T
 */
export abstract class ServiceCommand<T extends IEntity<TId>, TId> implements ICommand<IServiceState<T, TId>> {

  /**
   * Initialer Zustand
   */
  public static readonly INITIAL_STATE: IServiceState<any, any> = {
    currentItem: null,
    items: [],
    item: null,
    deletedId: null,
    state: ServiceRequestStates.UNDEFINED,
    error: undefined
  };

  protected constructor(private _storeId: string) {
  }

  /**
   * Liefert die zugehörige storeId.
   *
   * @readonly
   * @type {string}
   * @memberOf ServiceCommand
   */
  public get storeId(): string {
    return this._storeId;
  }


  /**
   * Führt das konkrete Command aus und liefert einen (ggf.) aktualisierten neuen Status zurück.
   *
   * @param {IServiceState<T>} [state=ServiceCommand.INITIAL_STATE]
   * @returns {IServiceState<T>}
   *
   * @memberOf ServiceCommand
   */
  public execute(state: IServiceState<T, TId> = ServiceCommand.INITIAL_STATE): IServiceState<T, TId> {
    return state;
  }
}