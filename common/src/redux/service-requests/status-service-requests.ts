import { Observable } from 'rxjs/Observable';
import { Subscriber } from 'rxjs/Subscriber';

// fluxgate
import { Core, IException, InvalidOperationException, IToString } from '@fluxgate/core';

import { IEntity } from '../../model/entity.interface';
import { EntityVersion } from '../../model/entityVersion';
import { FlxStatusEntity } from '../../model/flx-status-entity';
import { IService } from '../../model/service/service.interface';
import { ErrorCommand, ItemsFoundCommand } from '../command';
import { Store } from '../store/store';
import { ExtendedCrudServiceRequests } from './extended-crud-service-requests';

/**
 * Erweiterung von @see{ExtendedCrudServiceRequests} um @see{setDeleted}.
 *
 * @export
 * @class StatusServiceRequests
 * @template T
 * @template TId
 */
export abstract class StatusServiceRequests<T extends IEntity<TId>, TId extends IToString>
  extends ExtendedCrudServiceRequests<T, TId> {

  protected constructor(storeId: string, service: IService<T, TId>, store: Store,
    entityVersionService?: IService<EntityVersion, string>) {
    super(storeId, service, store, entityVersionService);
  }


  /**
   * Führt die delete-Methodes async aus und führt ein dispatch des zugehörigen Kommandos durch.
   * Delete markiert die Entity nur als deleted un löscht sie nicht wirklich!
   *
   * @param {TId} id
   *
   * @memberOf StatusServiceRequests
   */
  public delete(item: T): Observable<TId> {
    if (!(item instanceof FlxStatusEntity)) {
      throw new InvalidOperationException(
        `item ${Core.stringify(item)} is no FlxStatusEntity`);
    }

    return Observable.create((observer: Subscriber<TId>) => {
      try {
        item.__deleted = true;

        super.update(item).subscribe(
          (updateResult) => {
            // this.dispatch(new ItemDeletedCommand(this, updateResult.id));

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


  /**
   * Markiert die Entity als archiviert.
   *
   * @param {TId} id
   *
   * @memberOf StatusServiceRequests
   */
  public archive(item: T): Observable<TId> {
    if (!(item instanceof FlxStatusEntity)) {
      throw new InvalidOperationException(
        `item ${Core.stringify(item)} is no FlxStatusEntity`);
    }

    return Observable.create((observer: Subscriber<TId>) => {
      try {
        item.__archived = true;

        super.update(item).subscribe(
          (updateResult) => {
            // this.dispatch(new ItemDeletedCommand(this, updateResult.id));

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