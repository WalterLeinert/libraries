
import { IServiceState } from './service-state.interface';

/**
 * Interface für den Service-Status von CRUD Servicerequests, die nicht auf
 * Entities mit Ids basieren
 *
 * @export
 * @interface ISimpleServiceState
 * @template T
 */
export interface ISimpleServiceState<T> extends IServiceState {

  /**
   * aktuelle Item-Liste (z.B. für Anzeige im Grid)
   *
   * @type {T[]}
   * @memberOf IServiceState
   */
  items: T[];

  /**
   * aktuelles Item (z.B. nach create/update)
   *
   * @type {T}
   * @memberOf IServiceState
   */
  item: T;
}