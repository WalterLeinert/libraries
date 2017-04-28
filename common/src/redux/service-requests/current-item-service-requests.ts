import { IToString } from '@fluxgate/core';
import { IEntity } from '../../model/entity.interface';
import { SetCurrentItemCommand } from '../command/set-current-item-command';
import { Store } from '../store';
import { ICurrentItemServiceState } from './../state/current-item-service-state.interface';
import { ICurrentItemServiceRequests } from './current-item-service-requests.interface';
import { ServiceRequests } from './service-requests';


/**
 * Modelliert ServiceRequests, die ein "currentItem" unterstützen
 *
 * @export
 * @class ExtendedServiceRequests
 * @template T
 * @template TId
 * @template TService
 */
export class CurrentItemServiceRequests<T extends IEntity<TId>, TId extends IToString>
  extends ServiceRequests implements ICurrentItemServiceRequests<T, TId> {

  public static readonly INITIAL_STATE: ICurrentItemServiceState<any, any> = {
    ...ServiceRequests.INITIAL_STATE,
    currentItem: null
  };


  public constructor(storeId: string, store: Store) {
    super(storeId, store);
  }

  /**
   * Setzt das aktuelle Item.
   *
   * @param {T} item
   *
   * @memberOf ServiceRequests
   */
  public setCurrent(item: T): void {
    this.dispatch(new SetCurrentItemCommand(this, item));
  }

  public getCurrentItemState(storeId: string): ICurrentItemServiceState<T, TId> {
    return super.getStoreState(storeId) as ICurrentItemServiceState<T, TId>;
  }

}