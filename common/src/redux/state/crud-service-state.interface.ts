import { ISimpleServiceState } from './simple-service-state.interface';

/**
 * Interface für den Service-Status von CRUD Servicerequests
 *
 * @export
 * @interface ICrudServiceState
 * @template T
 * @template TId
 */
export interface ICrudServiceState<T, TId> extends ISimpleServiceState<T> {

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

  /**
   * Id des gelöschten Items
   *
   * @type {TId}
   * @memberOf IServiceState
   */
  deletedId: TId;

}