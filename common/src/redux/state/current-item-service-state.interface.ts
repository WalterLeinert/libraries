
import { IServiceState } from './service-state.interface';

/**
 * Interface für den Service-Status von SetCurrentItem-Servicerequests
 *
 * @export
 * @interface ICrudServiceState
 * @template T
 * @template TId
 */
export interface ICurrentItemServiceState<T> extends IServiceState {

  /**
   * aktuelles Item (z.B. nach Selektion im Grid)
   *
   * @type {T}
   * @memberOf IServiceState
   */
  currentItem: T;
}