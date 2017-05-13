import { Observable } from 'rxjs/Observable';

// fluxgate
import { EntityVersion, ExtendedCrudServiceRequests, IEntity, IService, Store } from '@fluxgate/common';
import { InvalidOperationException, IToString, Types } from '@fluxgate/core';

import { Service } from '@fluxgate/client';


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
  extends ExtendedCrudServiceRequests<T, TId> {

  constructor(storeId: string, service: TService, store: Store,
    entityVersionService?: IService<EntityVersion, string>) {
    super(storeId, service, store, entityVersionService);
  }


  /**
   *
   *
   * @param {T} item
   *
   * @memberOf EnhancedServiceRequests
   */
  public setDeleted(item: T): Observable<T> {
    if (!Types.hasProperty(item, 'deleted')) {
      throw new InvalidOperationException(`item ${JSON.stringify(item)} hat keine deleted-Property`);
    }
    (item as any).deleted = true;
    return this.update(item);
  }
}