import { IException, IToString } from '@fluxgate/core';

import { Observable } from 'rxjs/Observable';
import { Subscriber } from 'rxjs/Subscriber';

// -------------------------------------- logging --------------------------------------------
// tslint:disable-next-line:no-unused-variable
import { getLogger, ILogger, levels, using, XLog } from '@fluxgate/platform';

import { IEntity } from '../../model/entity.interface';
import { EntityVersion } from '../../model/entityVersion';
import { IService } from '../../model/service/service.interface';
import {
  CreatingItemCommand, DeletingItemCommand, ErrorCommand,
  ItemCreatedCommand, ItemDeletedCommand, ItemsFoundCommand,
  ItemUpdatedCommand, UpdatingItemCommand
} from '../command';
import { ICrudServiceState } from '../state/crud-service-state.interface';
import { CommandStore } from '../store/command-store';
import { Store } from '../store/store';
import { ICrudServiceRequests } from './crud-service-requests.interface';
import { ReadonlyServiceRequests } from './readonly-service-requests';
import { ServiceRequests } from './service-requests';


/**
 * Modelliert CRUD-Operationen über ServiceRequests und Rest-API.
 * Führt ein dispatch der jeweiligen Kommandos durch.
 *
 * @export
 * @class CrudServiceRequests
 * @template T
 * @template TId
 * @template TService
 */
export class CrudServiceRequests<T extends IEntity<TId>, TId extends IToString>
  extends ReadonlyServiceRequests<T, TId> implements ICrudServiceRequests<T, TId> {
  protected static readonly logger = getLogger(CrudServiceRequests);

  public static readonly INITIAL_STATE: ICrudServiceState<any, any> = {
    ...ServiceRequests.INITIAL_STATE,
    items: [],
    item: null,
    deletedId: null
  };


  public constructor(storeId: string | CommandStore<ICrudServiceState<T, TId>>, service: IService<T, TId>,
    store: Store, entityVersionService: IService<EntityVersion, string>, parentStoreId?: string) {
    super(storeId, service, store, entityVersionService, parentStoreId);
  }


  /**
   * Führt die update-Methode async aus und führt ein dispatch des zugehörigen Kommandos durch.
   *
   * @param {T} item
   *
   * @memberOf ServiceRequests
   */
  public create(item: T): Observable<T> {
    return Observable.create((observer: Subscriber<T>) => {
      try {
        this.dispatch(new CreatingItemCommand(this, item));

        this.getService().create(item).subscribe(
          (createResult) => {
            this.dispatch(new ItemCreatedCommand(this, createResult.item));

            // TODO: soll das so bleiben oder sollen wird das im Client behandeln?
            // Update der Itemliste nach create
            this.dispatch(new ItemsFoundCommand(this, [...this.getCrudState(this.storeId).items, createResult.item]));

            observer.next(createResult.item);
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
   * Führt die update-Methode async aus und führt ein dispatch des zugehörigen Kommandos durch.
   *
   * @param {T} item
   *
   * @memberOf ServiceRequests
   */
  public update(item: T): Observable<T> {
    return Observable.create((observer: Subscriber<T>) => {
      try {
        this.dispatch(new UpdatingItemCommand(this, item));

        this.getService().update(item).subscribe(
          (updateResult) => {
            this.dispatch(new ItemUpdatedCommand(this, updateResult.item));

            // TODO: soll das so bleiben oder sollen wird das im Client behandeln?
            // Update der Itemliste nach update
            this.dispatch(new ItemsFoundCommand(this,
              this.getCrudState(this.storeId).items.map((it) => it.id !== item.id ? it : updateResult.item)));

            observer.next(updateResult.item);
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
   * Führt die delete-Methodes async aus und führt ein dispatch des zugehörigen Kommandos durch.
   *
   * @param {TId} id
   *
   * @memberOf ServiceRequests
   */
  public delete(id: TId): Observable<TId> {
    return Observable.create((observer: Subscriber<TId>) => {
      try {
        this.dispatch(new DeletingItemCommand(this, id));

        this.getService().delete(id).subscribe(
          (deleteResult) => {
            this.dispatch(new ItemDeletedCommand(this, deleteResult.id));

            // TODO: soll das so bleiben oder sollen wird das im Client behandeln?
            // Update der Itemliste nach delete
            this.dispatch(new ItemsFoundCommand(this,
              this.getCrudState(this.storeId).items.filter((item) => item.id !== deleteResult.id)));

            observer.next(deleteResult.id);
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


  public getCrudState(storeId: string): ICrudServiceState<T, TId> {
    return super.getStoreState(storeId) as ICrudServiceState<T, TId>;
  }

  protected getService(): IService<T, TId> {
    return super.getService() as IService<T, TId>;
  }

}