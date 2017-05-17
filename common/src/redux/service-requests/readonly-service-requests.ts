import { IException, IToString } from '@fluxgate/core';

import { Observable } from 'rxjs/Observable';
import { Subscriber } from 'rxjs/Subscriber';

// -------------------------------------- logging --------------------------------------------
// tslint:disable-next-line:no-unused-variable
import { getLogger, ILogger, levels, using, XLog } from '@fluxgate/platform';
// -------------------------------------- logging --------------------------------------------

import { IQuery } from '@fluxgate/core';

import { IEntity } from '../../model/entity.interface';
import { EntityVersion } from '../../model/entityVersion';
import { IReadonlyService } from '../../model/service/readonly-service.interface';
import { IService } from '../../model/service/service.interface';
import { ProxyFactory } from '../cache/proxy-factory';
import {
  ErrorCommand,
  FindingItemByIdCommand, FindingItemsCommand,
  ItemFoundByIdCommand, ItemsFoundCommand, ItemsQueriedCommand,
  QueryingItemsCommand
} from '../command';
import { ICrudServiceState } from '../state/crud-service-state.interface';
import { CommandStore } from '../store/command-store';
import { Store } from '../store/store';
import { IReadonlyServiceRequests } from './readonly-service-requests.interface';
import { ServiceRequests } from './service-requests';


/**
 * Modelliert CRUD-Operationen über ServiceRequests und Rest-API.
 * Führt ein dispatch der jeweiligen Kommandos durch.
 *
 * @export
 * @class ReadonlyServiceRequests
 * @template T
 * @template TId
 * @template TService
 */
export class ReadonlyServiceRequests<T, TId extends IToString>
  extends ServiceRequests implements IReadonlyServiceRequests<T, TId> {
  protected static readonly logger = getLogger(ReadonlyServiceRequests);

  public static readonly INITIAL_STATE: ICrudServiceState<any, any> = {
    ...ServiceRequests.INITIAL_STATE,
    items: [],
    item: null,
    deletedId: null
  };

  private _service: IReadonlyService<T, TId>;

  public constructor(storeId: string | CommandStore<ICrudServiceState<T, TId>>, service: IReadonlyService<T, TId>,
    store: Store, entityVersionService: IService<EntityVersion, string>, parentStoreId?: string) {
    super(storeId, store, parentStoreId);

    this._service = ProxyFactory.createProxy(service as any as IReadonlyService<IEntity<TId>, TId>,
      entityVersionService) as any as IReadonlyService<T, TId>;
  }


  /**
   * Führt die query-Methode async aus und führt ein dispatch des zugehörigen Kommandos durch.
   *
   * @param {boolean} useCache - falls true, werden nur die Daten aus dem State übernommen; sonst Servercall
   * @memberOf ServiceRequests
   */
  public query(query: IQuery): Observable<T[]> {
    return Observable.create((observer: Subscriber<T[]>) => {
      try {
        this.dispatch(new QueryingItemsCommand(this, query));

        this.service.query(query).subscribe(
          (queryResult) => {
            this.dispatch(new ItemsQueriedCommand(this, queryResult.items));
            observer.next(queryResult.items);
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
   * @memberOf ServiceRequests
   */
  public find(): Observable<T[]> {
    return Observable.create((observer: Subscriber<T[]>) => {

      try {
        this.dispatch(new FindingItemsCommand(this));

        this.service.find().subscribe(
          (findResult) => {
            this.dispatch(new ItemsFoundCommand(this, findResult.items));
            observer.next(findResult.items);
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
   * Find the entity with the given id and return {Promise<T>}
   *
   * @param {TId} id
   * @returns {Promise<T>}
   *
   * @memberOf ReadonlyServiceRequests
   */
  public findById<T extends IEntity<TId>>(id: TId): Observable<T> {
    return Observable.create((observer: Subscriber<IEntity<TId>>) => {
      try {
        this.dispatch(new FindingItemByIdCommand(this, id));

        this.service.findById(id).subscribe(
          (findByIdResult) => {
            this.dispatch(new ItemFoundByIdCommand(this, findByIdResult.item));
            observer.next(findByIdResult.item);
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


  public getEntityId(item: T): TId {
    return this._service.getEntityId(item);
  }

  public getModelClassName(): string {
    return this._service.getModelClassName();
  }

  protected get service(): IReadonlyService<T, TId> {
    return this._service;
  }
}