import { IException } from '@fluxgate/core';

import { IEntity } from '../model/entity.interface';
import { ServiceRequestState } from './service-request-state';

/**
 * Interface für den Service-Status
 *
 * @export
 * @interface IServiceState
 * @template T
 * @template TId
 */
export interface IServiceState<T extends IEntity<TId>, TId> {
  /**
   * aktuelles Item (z.B. nach Selektion im Grid)
   *
   * @type {T}
   * @memberOf IServiceState
   */
  currentItem: T;

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

  /**
   * Der Status des zugehörigen Servicerequests.
   * Falls der Status @see{ServiceRequestStates.ERROR} ist, findet man in @see{error} die Details
   *
   * @type {ServiceRequestState}
   * @memberOf IServiceState
   */
  state: ServiceRequestState;

  /**
   * Falls bei einem Servicecall ein Fehler aufgetreten ist, enthält error die ensprechende Exception
   *
   * @type {IException}
   * @memberOf IServiceState
   */
  error: IException;
}