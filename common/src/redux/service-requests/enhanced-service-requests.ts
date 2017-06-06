import { Observable } from 'rxjs/Observable';
import { Subscriber } from 'rxjs/Subscriber';

// fluxgate
import { IException, InvalidOperationException, IToString, Types } from '@fluxgate/core';

import { IEntity } from '../../model/entity.interface';
import { EntityVersion } from '../../model/entityVersion';
import { FlxStatusEntity } from '../../model/flx-status-entity';
import { IService } from '../../model/service/service.interface';
import {
  DeletingItemCommand, ErrorCommand,
  ItemDeletedCommand, ItemsFoundCommand
} from '../command';
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


  // /**
  //  * Setzt den Entity-Status auf deleted.
  //  *
  //  * @param {T} item
  //  *
  //  * @memberOf EnhancedServiceRequests
  //  */
  // public setDeleted(item: T): Observable<T> {
  //   if (!(item instanceof FlxStatusEntity)) {
  //     throw new InvalidOperationException(`item ${JSON.stringify(item)} hat keine deleted-Property`);
  //   }
  //   item.__deleted = true;
  //   return this.update(item);
  // }

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

  /**
   * Führt die delete-Methodes async aus und führt ein dispatch des zugehörigen Kommandos durch.
   * Delete markiert die Entity nur als deleted un löscht sie nicht wirklich!
   *
   * @param {TId} id
   *
   * @memberOf EnhancedServiceRequests
   */
  public delete(item: T): Observable<TId> {
    if (!(item instanceof FlxStatusEntity)) {
      throw new InvalidOperationException(
        `item ${JSON.stringify(item)} has no deleted property (is no FlxStatusEntity)`);
    }

    return Observable.create((observer: Subscriber<TId>) => {
      try {
        item.__deleted = true;

        super.update(item).subscribe(
          (updateResult) => {
            this.dispatch(new ItemDeletedCommand(this, updateResult.id));

            this.dispatch(new ItemsFoundCommand(this,
              this.getCrudState(this.storeId).items.filter((it) => it.id !== updateResult.id)));

            observer.next(updateResult.id);
          },
          (exc: IException) => {
            this.dispatch(new ErrorCommand(this, exc));
            observer.error(exc);
          });

      } catch (exc) {
        observer.error(exc);
      }
    });
  }

}