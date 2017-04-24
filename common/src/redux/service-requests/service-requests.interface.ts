import { ICommand } from '../command/command.interface';
import { IServiceState } from '../state/service-state.interface';

/**
 * Basis-Interface für Servicerequests.
 *
 * @export
 * @interface IServiceRequests
 * @template T
 * @template TId
 */
export interface IServiceRequests {

  /**
   * Liefert die Store-Id
   *
   * @readonly
   * @type {string}
   * @memberOf ServiceRequests
   */
  storeId: string;


  /**
   * Liefert den Status für die @param{storeId}
   *
   * @template T
   * @template TId
   * @param {string} storeId
   * @returns {IServiceState}
   *
   * @memberOf IServiceRequests
   */
  getStoreState(storeId: string): IServiceState;



  /**
   * erzeugt aus dem bisherigen Status @param{state} (ggf) einen neuen Status.
   *
   * @param {IServiceState}
   * @returns {IServiceState}
   *
   * @memberOf ServiceCommand
   */
  updateState(command: ICommand<IServiceState>, state: IServiceState): IServiceState;
}