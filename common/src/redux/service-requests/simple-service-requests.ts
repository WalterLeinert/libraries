import { ServiceRequestStates } from '../state/service-request-state';
import { ISimpleServiceState } from '../state/simple-service-state.interface';
import { CommandStore } from '../store/command-store';
import { Store } from '../store/store';
import { ServiceRequests } from './service-requests';


/**
 * abstrakte Basisklasse für Servicerequests.
 *
 * @export
 * @class ServiceRequests
 * @template T
 * @template TId
 * @template TService
 */
export abstract class SimpleServiceRequests<T> extends ServiceRequests {

  /**
   * Initialer Zustand
   */
  public static readonly INITIAL_STATE: ISimpleServiceState<any> = {
    items: [],
    item: null,
    state: ServiceRequestStates.UNDEFINED,
    error: undefined
  };

  protected constructor(storeId: string | CommandStore<ISimpleServiceState<T>>, store: Store, parentStoreId?: string) {
    super(storeId, store, parentStoreId);
  }

}