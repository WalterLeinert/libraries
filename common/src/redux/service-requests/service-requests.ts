import { Assert, CustomSubject, Types } from '@fluxgate/core';

import { ServiceRequestStates } from '../state/service-request-state';
import { IServiceState } from '../state/service-state.interface';
import { CommandStore } from '../store/command-store';
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

  private _storeId: string;


  protected constructor(storeId: string | CommandStore<any>, private _store: Store, parentStoreId?: string) {
    Assert.notNull(storeId);
    Assert.notNull(_store);

    if (Types.isString(storeId)) {
      this._storeId = storeId as string;
      Assert.that(!Types.isPresent(parentStoreId), 'if storeId is given, not parentStoreId is allowed');
    } else {
      const commandStore = storeId as CommandStore<any>;
      if (Types.isPresent(parentStoreId)) {
        const parentStore = this._store.getCommandStore(parentStoreId);
        commandStore.setParent(parentStore);
      }
      this._store.add(commandStore);
      this._storeId = commandStore.name;
    }
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
   * @memberOf ServiceRequests
   */
  public updateState(command: ICommand<IServiceState>, state: IServiceState): IServiceState {
    return state;
  }

  /**
   * Liefert das Subject für die Id @param{storeId} für eine anschliessende Subscription.
   *
   * @param {string} storeId
   * @returns {CustomSubject<any>}
   *
   * @memberOf ServiceRequests
   */
  protected subject(storeId: string): CustomSubject<any> {
    return this._store.subject(storeId);
  }

}