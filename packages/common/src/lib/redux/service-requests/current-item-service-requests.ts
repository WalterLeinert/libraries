import { Observable ,  Subscriber } from 'rxjs';

import { CurrentItemSetCommand } from '../command/current-item-set-command';
import { SettingCurrentItemCommand } from '../command/setting-current-item-command';
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
export class CurrentItemServiceRequests<T>
  extends ServiceRequests implements ICurrentItemServiceRequests<T> {

  public static readonly INITIAL_STATE: ICurrentItemServiceState<any> = {
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
  public setCurrent(item: T): Observable<T> {
    return Observable.create((observer: Subscriber<T>) => {
      try {
        this.dispatch(new SettingCurrentItemCommand(this, item));

        this.dispatch(new CurrentItemSetCommand(this, item));
        observer.next(item);
      } catch (exc) {
        observer.error(exc);
      }
    });
  }

  public getCurrentItemState(storeId: string): ICurrentItemServiceState<T> {
    return super.getStoreState(storeId) as ICurrentItemServiceState<T>;
  }

}