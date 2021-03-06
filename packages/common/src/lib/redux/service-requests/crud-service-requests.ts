import { Observable ,  Subscriber } from 'rxjs';

// -------------------------------------- logging --------------------------------------------
// tslint:disable-next-line:no-unused-variable
import { getLogger, ILogger, levels, using, XLog } from '@fluxgate/platform';
// -------------------------------------- logging --------------------------------------------

import { Assert, IException, IToString } from '@fluxgate/core';

import { IEntity } from '../../model/entity.interface';
import { EntityVersion } from '../../model/entityVersion';
import { IService } from '../../model/service/service.interface';
import {
  CreatingItemCommand, CurrentItemSetCommand, DeletingItemCommand, ErrorCommand,
  ItemCreatedCommand, ItemDeletedCommand, ItemsFoundCommand,
  ItemUpdatedCommand, UpdatingItemCommand
} from '../command';
import { ICrudServiceState } from '../state/crud-service-state.interface';
import { ICurrentItemServiceState } from '../state/current-item-service-state.interface';
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
            this.dispatch(new ItemsFoundCommand(this,
              [...this.getCrudState(this.storeId).items, createResult.item], true));

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
              this.getCrudState(this.storeId).items.map((it) => it.id !== item.id ? it : updateResult.item), true));

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
  public deleteById(id: TId): Observable<TId> {
    return Observable.create((observer: Subscriber<TId>) => {
      try {
        this.dispatch(new DeletingItemCommand(this, id));

        this.getService().delete(id).subscribe(
          (deleteResult) => {
            this.handleDelete(deleteResult.id);
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


  /**
   * Führt die delete-Methodes async aus und führt ein dispatch des zugehörigen Kommandos durch.
   *
   * @param {TId} id
   *
   * @memberOf ServiceRequests
   */
  public delete(item: T): Observable<TId> {
    return Observable.create((observer: Subscriber<TId>) => {
      try {
        this.dispatch(new DeletingItemCommand(this, item.id));

        this.getService().delete(item.id).subscribe(
          (deleteResult) => {
            this.handleDelete(deleteResult.id);
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


  private handleDelete(deletedId: TId) {
    // Status for dispatch ItemDeletedCommand -> CurrentItem noch gesetzt
    const preDeleteState = this.getCrudState(this.storeId);

    this.dispatch(new ItemDeletedCommand(this, deletedId));

    // TODO: soll das so bleiben oder sollen wird das im Client behandeln?
    // Update der Itemliste nach delete
    this.dispatch(new ItemsFoundCommand(this,
      this.getCrudState(this.storeId).items.filter((item) => item.id !== deletedId), true));

    // falls das currentItem gelöscht wurde, setzen wir ein neues currentItem
    this.dispatchCurrentItem(preDeleteState, deletedId);
  }


  /**
   * falls ein currentItemState existiert und das akutelle Item gelöscht wurde,
   * ermitteln wir ein neues akutelles Item und dispatchen ein CurrentItemSetCommand
   *
   * @param state
   * @param deletedId
   */
  private dispatchCurrentItem(state: ICrudServiceState<T, TId>, deletedId: TId) {
    const currentItemState = state as any as ICurrentItemServiceState<T>;
    let currentItem: T;

    //
    // wurde currentItem glöscht?
    // falls ja, selektieren wir das nächste aus der Umgebung
    //
    if (currentItemState && currentItemState.currentItem && currentItemState.currentItem.id === deletedId) {
      let itemIndex = state.items.findIndex((it) => it.id === deletedId);
      Assert.that(itemIndex >= 0 && itemIndex < state.items.length);

      if (itemIndex >= state.items.length - 1) {
        itemIndex = state.items.length - 2;       // letztes Element wurde gelöscht
        currentItem = state.items[state.items.length - 2];
      } else if (itemIndex === 0) {
        itemIndex = 1;
      } else {
        itemIndex++;
      }

      // gültiger Index, letztes Element gelöscht?
      if (itemIndex >= 0 && itemIndex < state.items.length) {
        currentItem = state.items[itemIndex];
      }


      // falls das currentItem gelöscht wurde, setzen wir ein neues currentItem
      this.dispatch(new CurrentItemSetCommand(this, currentItem));
    }
  }

}