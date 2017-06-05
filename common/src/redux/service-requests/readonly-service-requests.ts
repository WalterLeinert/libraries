import { IException, IToString } from '@fluxgate/core';

import { Observable } from 'rxjs/Observable';
import { Subscriber } from 'rxjs/Subscriber';

// -------------------------------------- logging --------------------------------------------
// tslint:disable-next-line:no-unused-variable
import { getLogger, ILogger, levels, using, XLog } from '@fluxgate/platform';
// -------------------------------------- logging --------------------------------------------


import { IEntity } from '../../model/entity.interface';
import { EntityVersion } from '../../model/entityVersion';
import { IReadonlyService } from '../../model/service/readonly-service.interface';
import { IService } from '../../model/service/service.interface';
import {
  ErrorCommand,
  FindingItemByIdCommand,
  ItemFoundByIdCommand
} from '../command';
import { ICrudServiceState } from '../state/crud-service-state.interface';
import { CommandStore } from '../store/command-store';
import { Store } from '../store/store';
import { CoreServiceRequests } from './core-service-requests';
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
export class ReadonlyServiceRequests<T extends IEntity<TId>, TId extends IToString>
  extends CoreServiceRequests<T> implements IReadonlyServiceRequests<T, TId> {
  protected static readonly logger = getLogger(ReadonlyServiceRequests);

  public static readonly INITIAL_STATE: ICrudServiceState<any, any> = {
    ...ServiceRequests.INITIAL_STATE,
    items: [],
    item: null,
    deletedId: null
  };


  public constructor(storeId: string | CommandStore<ICrudServiceState<T, TId>>, service: IReadonlyService<T, TId>,
    store: Store, entityVersionService: IService<EntityVersion, string>, parentStoreId?: string) {
    super(storeId, service, store, entityVersionService, parentStoreId);
  }


  /**
   * Find the entity with the given id and return {Promise<T>}
   *
   * @param {TId} id
   * @returns {Promise<T>}
   *
   * @memberOf ReadonlyServiceRequests
   */
  public findById<T>(id: TId): Observable<T> {
    return Observable.create((observer: Subscriber<IEntity<TId>>) => {
      try {
        this.dispatch(new FindingItemByIdCommand(this, id));

        this.getService().findById(id).subscribe(
          (findByIdResult) => {
            this.dispatch(new ItemFoundByIdCommand(this, findByIdResult.item));
            observer.next(findByIdResult.item);
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


  public getEntityId(item: T): TId {
    return this.getService().getEntityId(item);
  }

  protected getService(): IReadonlyService<T, TId> {
    return super.getService() as IReadonlyService<T, TId>;
  }
}