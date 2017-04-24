import { Assert } from '@fluxgate/core';
import { ServiceRequestStates } from '../state/service-request-state';
import { IServiceState } from '../state/service-state.interface';
import { Store } from '../store/store';
import { ICommand } from './../command/command.interface';
import { IServiceRequests } from './service-requests.interface';

/**
 * abstrakte Basisklasse für Servicerequests.
 *
 * @export
 * @class ServiceRequests
 * @template T
 * @template TId
 * @template TService
 */
export abstract class ServiceRequests implements IServiceRequests {

  /**
   * Initialer Zustand
   */
  public static readonly INITIAL_STATE: IServiceState = {
    state: ServiceRequestStates.UNDEFINED,
    error: undefined
  };


  protected constructor(private _storeId: string, private _store: Store) {
    Assert.notNullOrEmpty(_storeId);
    Assert.notNull(_store);
  }


  public get storeId(): string {
    return this._storeId;
  }


  public dispatch(command: ICommand<any>) {
    Assert.notNull(command);

    this._store.dispatch(command);
  }


  public getStoreState(storeId: string): IServiceState {
    return this._store.getState(storeId);
  }

  /**
   * erzeugt aus dem bisherigen Status @param{state} einen neuen Status.
   *
   * @param {IServiceState} [state=ServiceRequests.INITIAL_STATE]
   * @returns {IServiceState}
   *
   * @memberOf ServiceCommand
   */
  public updateState(command: ICommand<IServiceState>, state: IServiceState): IServiceState {
    return state;
  }

}