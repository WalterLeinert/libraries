import { Observable } from 'rxjs/Observable';
import { Subscriber } from 'rxjs/Subscriber';

import { IException } from '@fluxgate/core';

import { EntityVersion } from '../../model/entityVersion';
import { ICoreService } from '../../model/service/core-service.interface';
import { IService } from '../../model/service/service.interface';
import { StatusFilter } from '../../model/service/status-filter';
import { IStatusQuery } from '../../model/service/status-query';
import { ProxyFactory } from '../cache/proxy-factory';
import {
  ErrorCommand, FindingItemsCommand, ItemsFoundCommand, ItemsQueriedCommand,
  QueryingItemsCommand
} from '../command';
import { ICoreServiceState } from '../state/core-service-state.interface';
import { ServiceRequestStates } from '../state/service-request-state';
import { CommandStore } from '../store/command-store';
import { Store } from '../store/store';
import { ICoreServiceRequests } from './core-service-requests.interface';
import { ServiceRequests } from './service-requests';

/**
 * abstrakte Basisklasse für Servicerequests. Die Servicerequests liefern Entities,
 * die keine Id/primray key haben müssen (implementieren nicht das Interface @see{IEntity}).
 *
 * @export
 * @class ServiceRequests
 * @template T
 * @template TId
 * @template TService
 */
export abstract class CoreServiceRequests<T> extends ServiceRequests implements ICoreServiceRequests<T> {

  /**
   * Initialer Zustand
   */
  public static readonly INITIAL_STATE: ICoreServiceState<any> = {
    items: [],
    item: null,
    state: ServiceRequestStates.UNDEFINED,
    error: undefined
  };

  private _coreService: ICoreService<T>;

  protected constructor(storeId: string | CommandStore<ICoreServiceState<T>>,
    service: ICoreService<T>, store: Store, entityVersionService: IService<EntityVersion, string>,
    parentStoreId?: string) {
    super(storeId, store, parentStoreId);

    if (service.tableMetadata.options.isView) {
      this._coreService = service;
    } else {
      this._coreService = ProxyFactory.createProxy(service as IService<any, any>,
        entityVersionService) as any as ICoreService<T>;
    }
  }


  /**
   * Führt die query-Methode async aus und führt ein dispatch des zugehörigen Kommandos durch.
   *
   * @param {boolean} useCache - falls true, werden nur die Daten aus dem State übernommen; sonst Servercall
   * @memberOf ServiceRequests
   */
  public query(query: IStatusQuery): Observable<T[]> {
    return Observable.create((observer: Subscriber<T[]>) => {
      try {
        this.dispatch(new QueryingItemsCommand(this, query));

        this._coreService.query(query).subscribe(
          (queryResult) => {
            this.dispatch(new ItemsQueriedCommand(this, queryResult.items, queryResult.__fromCache));
            observer.next(queryResult.items);
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
   * Führt die find-Methode async aus und führt ein dispatch des zugehörigen Kommandos durch.
   *
   * @memberOf ServiceRequests
   */
  public find(filter?: StatusFilter): Observable<T[]> {
    return Observable.create((observer: Subscriber<T[]>) => {

      try {
        this.dispatch(new FindingItemsCommand(this));

        this._coreService.find(filter).subscribe(
          (findResult) => {
            this.dispatch(new ItemsFoundCommand(this, findResult.items, findResult.__fromCache));
            observer.next(findResult.items);
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


  public getModelClassName(): string {
    return this._coreService.getModelClassName();
  }

  protected getService(): ICoreService<T> {
    return this._coreService;
  }
}