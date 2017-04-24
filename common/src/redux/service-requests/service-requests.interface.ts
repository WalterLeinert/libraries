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
}