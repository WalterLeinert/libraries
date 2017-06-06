import { Observable } from 'rxjs/Observable';

// fluxgate
import { InvalidOperationException, IToString, Types } from '@fluxgate/core';


import { IEntity } from '../../model/entity.interface';
import { EntityVersion } from '../../model/entityVersion';
import { FlxStatusEntity } from '../../model/flx-status-entity';
import { IService } from '../../model/service/service.interface';
import { Store } from '../store/store';
import { ExtendedCrudServiceRequests } from './extended-crud-service-requests';

/**
 * Erweiterung von @see{ExtendedCrudServiceRequests} um @see{setDeleted}.
 *
 * @export
 * @class EnhancedServiceRequests
 * @template T
 * @template TId
 */
export abstract class EnhancedServiceRequests<T extends IEntity<TId>, TId extends IToString>
  extends ExtendedCrudServiceRequests<T, TId> {

  protected constructor(storeId: string, service: IService<T, TId>, store: Store,
    entityVersionService?: IService<EntityVersion, string>) {
    super(storeId, service, store, entityVersionService);
  }


  /**
   * Setzt den Entity-Status auf deleted.
   *
   * @param {T} item
   *
   * @memberOf EnhancedServiceRequests
   */
  public setDeleted(item: T): Observable<T> {
    if (!(item instanceof FlxStatusEntity)) {
      throw new InvalidOperationException(`item ${JSON.stringify(item)} hat keine deleted-Property`);
    }
    item.__deleted = true;
    return this.update(item);
  }

  /**
   * Setzt den Entity-Status auf archived.
   *
   * @param {T} item
   *
   * @memberOf EnhancedServiceRequests
   */
  public setArchived(item: T): Observable<T> {
    if (!(item instanceof FlxStatusEntity)) {
      throw new InvalidOperationException(`item ${JSON.stringify(item)} hat keine archived-Property`);
    }
    item.__archived = true;
    return this.update(item);
  }
}