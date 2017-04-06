// fluxgate
import { IEntity, InvalidOperationException, IToString, Store, Types } from '@fluxgate/common';

import { Service } from '../angular/services/service';
import { ServiceRequests } from './service-requests';


/**
 * Erweiterung von @see{ServiceRequests} um @see{setDeleted}.
 *
 * @export
 * @class EnhancedServiceRequests
 * @template T
 * @template TId
 * @template TService
 */
export abstract class EnhancedServiceRequests<T extends IEntity<TId>, TId extends IToString,
  TService extends Service<T, TId>>
  extends ServiceRequests<T, TId, TService> {

  constructor(storeId: string, service: TService, store: Store) {
    super(storeId, service, store);
  }


  /**
   *
   *
   * @param {T} item
   *
   * @memberOf EnhancedServiceRequests
   */
  public setDeleted(item: T): void {
    if (!Types.hasProperty(item, 'deleted')) {
      throw new InvalidOperationException(`item ${JSON.stringify(item)} hat keine deleted-Property`);
    }
    (item as any).deleted = true;
    this.update(item);
  }
}