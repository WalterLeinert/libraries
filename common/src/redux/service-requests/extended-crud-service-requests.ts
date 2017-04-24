import { IToString } from '@fluxgate/core';
import { IEntity } from '../../model/entity.interface';
import { IService } from '../../model/service/service.interface';
import { Store } from '../store';
import { ICrudServiceState } from './../state/crud-service-state.interface';
import { ICurrentItemServiceState } from './../state/current-item-service-state.interface';
import { IExtendedCrudServiceState } from './../state/extended-crud-service-state.interface';
import { CrudServiceRequests } from './crud-service-requests';
import { ICrudServiceRequests } from './crud-service-requests.interface';
import { CurrentItemServiceRequests } from './current-item-service-requests';
import { ICurrentItemServiceRequests } from './current-item-service-requests.interface';
import { IExtendedCrudServiceRequests } from './extended-crud-service-requests.interface';
import { ServiceRequests } from './service-requests';


/**
 * abstrakte Basisklasse für ServiceRequests, die ein "currentItem" unterstützen + CRUD-Operationen
 *
 * @export
 * @class ExtendedCrudServiceRequests
 * @template T
 * @template TId
 * @template TService
 */
export abstract class ExtendedCrudServiceRequests<T extends IEntity<TId>, TId extends IToString,
  TService extends IService<T, TId>> extends ServiceRequests
  implements IExtendedCrudServiceRequests<T, TId> {

  public static readonly INITIAL_STATE: IExtendedCrudServiceState<any, any> = {
    ...CrudServiceRequests.INITIAL_STATE,
    currentItem: null
  };

  private crudServiceRequests: ICrudServiceRequests<T, TId>;
  private currentItemServiceRequests: ICurrentItemServiceRequests<T, TId>;

  protected constructor(storeId: string, service: TService, store: Store) {
    super(storeId, store);

    this.crudServiceRequests = new CrudServiceRequests<T, TId, TService>(storeId, service, store);
    this.currentItemServiceRequests = new CurrentItemServiceRequests<T, TId>(storeId, store);
  }


  public setCurrent(item: T): void {
    this.currentItemServiceRequests.setCurrent(item);
  }

  public create(item: T): void {
    this.crudServiceRequests.create(item);
  }


  public find(useCache: boolean = false): void {
    this.crudServiceRequests.find(useCache);
  }

  public findById(id: TId): void {
    this.crudServiceRequests.findById(id);
  }

  public update(item: T): void {
    this.crudServiceRequests.update(item);
  }

  public delete(id: TId): void {
    this.crudServiceRequests.delete(id);
  }

  public getEntityId(item: T): TId {
    return this.crudServiceRequests.getEntityId(item);
  }

  public getModelClassName(): string {
    return this.crudServiceRequests.getModelClassName();
  }


  public getCrudState(storeId: string): ICrudServiceState<T, TId> {
    return this.crudServiceRequests.getCrudState(storeId) as ICrudServiceState<T, TId>;
  }

  public getCurrentItemState(storeId: string): ICurrentItemServiceState<T, TId> {
    return this.currentItemServiceRequests.getCurrentItemState(storeId);
  }
}