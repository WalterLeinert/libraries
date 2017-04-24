import { IEntity } from '../../model/entity.interface';
import { IServiceState } from '../state/service-state.interface';
import { ServiceRequests } from './../service-requests/service-requests';
import { ICommand } from './command.interface';


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
export abstract class ServiceCommand<T extends IEntity<TId>, TId> implements ICommand<IServiceState> {


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
  public execute(state: IServiceState = ServiceRequests.INITIAL_STATE): IServiceState {
    return state;
  }

  public hasModifiedItems(): boolean {
    return false;
  }
}