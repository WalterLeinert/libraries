import { IEntity } from '../../model/entity.interface';
import { IServiceState } from '../state/service-state.interface';
import { ServiceRequests } from './../service-requests/service-requests';
import { IServiceRequests } from './../service-requests/service-requests.interface';
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


  protected constructor(private _serviceRequests: IServiceRequests) {
  }

  /**
   * Liefert die zugehörige storeId.
   *
   * @readonly
   * @type {string}
   * @memberOf ServiceCommand
   */
  public get storeId(): string {
    return this._serviceRequests.storeId;
  }


  public hasModifiedItems(): boolean {
    return false;
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
    //
    // zunächst update durch das konkrete Kommando
    //
    const commandState = this.updateState(state);

    //
    // ... und dann ggf. noch update über konrkete ServiceRequests (z.B. currentItem anpassen)
    //
    return this._serviceRequests.updateState(this, commandState);
  }


  public toString(): string {
    return `${this.constructor.name}: storeId = ${this.storeId}`;
  }


  /**
   * erzeugt aus dem bisherigen Status @param{state} einen neuen Status.
   *
   * @param {IServiceState} [state=ServiceRequests.INITIAL_STATE]
   * @returns {IServiceState}
   *
   * @memberOf ServiceCommand
   */
  protected updateState(state: IServiceState = ServiceRequests.INITIAL_STATE): IServiceState {
    return state;
  }

}