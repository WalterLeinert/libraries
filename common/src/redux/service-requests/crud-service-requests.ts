import { IException, IToString } from '@fluxgate/core';

import { Observable } from 'rxjs/Observable';
import { Subscriber } from 'rxjs/Subscriber';

// -------------------------------------- logging --------------------------------------------
// tslint:disable-next-line:no-unused-variable
import { getLogger, ILogger, levels, using, XLog } from '@fluxgate/platform';
// -------------------------------------- logging --------------------------------------------

import { IEntity } from '../../model/entity.interface';
import { IService } from '../../model/service/service.interface';
import {
  CreatingItemCommand, DeletingItemCommand, ErrorCommand,
  FindingItemByIdCommand, FindingItemsCommand,
  ItemCreatedCommand, ItemDeletedCommand, ItemFoundByIdCommand, ItemsFoundCommand,
  ItemUpdatedCommand, UpdatingItemCommand
} from '../command';
import { ICrudServiceState } from '../state/crud-service-state.interface';
import { ServiceRequestStates } from '../state/service-request-state';
import { Store } from '../store';
import { CommandStore } from '../store/command-store';
import { ICrudServiceRequests } from './crud-service-requests.interface';
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
export class CrudServiceRequests<T extends IEntity<TId>, TId extends IToString,
  TService extends IService<T, TId>> extends ServiceRequests implements ICrudServiceRequests<T, TId> {
  protected static readonly logger = getLogger(CrudServiceRequests);


  public static readonly INITIAL_STATE: ICrudServiceState<any, any> = {
    ...ServiceRequests.INITIAL_STATE,
    items: [],
    item: null,
    deletedId: null
  };


  public constructor(storeId: string | CommandStore<any>, private _service: TService,
    store: Store, parentStoreId?: string) {
    super(storeId, store, parentStoreId);
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

        this.service.create(item).subscribe(
          (elem) => {
            this.dispatch(new ItemCreatedCommand(this, elem));
            observer.next(elem);
          },
          (exc: IException) => {
            this.dispatch(new ErrorCommand(this, exc));
            throw exc;
          });
      } catch (exc) {
        observer.error(exc);
      }
    });
  }


  /**
   * Führt die find-Methode async aus und führt ein dispatch des zugehörigen Kommandos durch.
   *
   * @param {boolean} useCache - falls true, werden nur die Daten aus dem State übernommen; sonst Servercall
   * @memberOf ServiceRequests
   */
  public find(useCache: boolean = false): Observable<T[]> {
    return Observable.create((observer: Subscriber<T[]>) => {
      const state = this.getCrudState(this.storeId);

      try {
        this.dispatch(new FindingItemsCommand(this));

        const finder = () => {
          this.service.find().subscribe(
            (items) => {
              this.dispatch(new ItemsFoundCommand(this, items));
              observer.next(items);
            },
            (exc: IException) => {
              this.dispatch(new ErrorCommand(this, exc));
              throw exc;
            });
        };

        if (useCache) {
          if (state.state === ServiceRequestStates.UNDEFINED) {
            finder();

          } else {
            // items aus dem State liefern
            this.dispatch(new ItemsFoundCommand(this, [...state.items]));
            observer.next([...state.items]);
          }
        } else {
          finder();
        }

      } catch (exc) {
        observer.error(exc);
      }
    });
  }



  /**
   * Find the entity with the given id and return {Promise<T>}
   *
   * @param {TId} id
   * @returns {Promise<T>}
   *
   * @memberOf CrudServiceRequests
   */
  public findById(id: TId): Observable<T> {
    return Observable.create((observer: Subscriber<T>) => {
      try {
        this.dispatch(new FindingItemByIdCommand(this, id));

        this.service.findById(id).subscribe(
          (elem) => {
            this.dispatch(new ItemFoundByIdCommand(this, elem));
            observer.next(elem);
          },
          (exc: IException) => {
            this.dispatch(new ErrorCommand(this, exc));
            throw exc;
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

        this.service.update(item).subscribe(
          (elem) => {
            this.dispatch(new ItemUpdatedCommand(this, elem));
            observer.next(elem);
          },
          (exc: IException) => {
            this.dispatch(new ErrorCommand(this, exc));
            throw exc;
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

        this.service.delete(id).subscribe(
          (result) => {
            this.dispatch(new ItemDeletedCommand(this, result.id));
            observer.next(result.id);
          },
          (exc: IException) => {
            this.dispatch(new ErrorCommand(this, exc));
            throw exc;
          });

      } catch (exc) {
        observer.error(exc);
      }
    });
  }


  public getCrudState(storeId: string): ICrudServiceState<T, TId> {
    return super.getStoreState(storeId) as ICrudServiceState<T, TId>;
  }

  public getEntityId(item: T): TId {
    return this._service.getEntityId(item);
  }

  public getModelClassName(): string {
    return this._service.getModelClassName();
  }

  protected get service(): TService {
    return this._service;
  }
}