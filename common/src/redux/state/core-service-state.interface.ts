import { IServiceState } from './service-state.interface';


/**
 * Interface für den Service-Status von Servicerequests, die nicht auf
 * Entities mit Ids basieren
 *
 * @export
 * @interface ICoreServiceState
 * @template T
 */
export interface ICoreServiceState<T> extends IServiceState {

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