// tslint:disable:member-access

// tslint:disable-next-line:no-var-requires
require('reflect-metadata');

import { Subscription } from 'rxjs/Subscription';


// -------------------------- logging -------------------------------
// tslint:disable-next-line:no-unused-variable
import { getLogger, ILogger, levels, using, XLog } from '@fluxgate/platform';
// -------------------------- logging -------------------------------

import { Assert, CustomSubject, ICtor, IToString } from '@fluxgate/core';

import { IEntity } from '../../src/model';
import { IService } from '../../src/model/service/service.interface';


import {
  ICrudServiceRequests, ICrudServiceState, ICurrentItemServiceRequests, ICurrentItemServiceState,
  IServiceRequests, IServiceState, ServiceCommand, ServiceRequests, Store
} from '../../src/redux';
import { EntityVersionCache } from '../../src/redux/cache/entity-version-cache';
import { EntityVersionServiceFake } from '../../src/testing/entity-version-service-fake';
import { CommonTest } from '../common.spec';


export class ReduxBaseTest<T extends IEntity<TId>, TId extends IToString, TService
  extends IService<T, TId>> extends CommonTest {
  protected static readonly logger = getLogger(ReduxBaseTest);

  private _store: Store;
  private _serviceFake: TService;
  private _serviceRequests: IServiceRequests;
  private subscriptions: Subscription[] = [];
  private _commands: Array<ServiceCommand<T>> = [];
  private _states: IServiceState[] = [];
  private _entityVersionServiceFake: EntityVersionServiceFake;

  protected constructor(private storeId: string,
    private serviceRequestClazz: ICtor<ServiceRequests>,
    private serviceClazz: ICtor<TService>) {
    super();
  }


  protected before(done: (err?: any) => void) {
    this._store = new Store();
    this._entityVersionServiceFake = new EntityVersionServiceFake();
    this._serviceFake = new this.serviceClazz(this._entityVersionServiceFake);
    this._serviceRequests = new this.serviceRequestClazz(this.storeId, this._serviceFake, this._store,
      this._entityVersionServiceFake);

    this.subscribeToStore(this.storeId);
    this.reset();

    done();
  }


  protected subscribeToStore<T, TId>(storeId: string): Subscription {
    const subscription = this.getStoreSubject(storeId).subscribe((command) => {
      this.onStoreUpdated(command);
    });
    this.subscriptions.push(subscription);
    return subscription;
  }

  protected onStoreUpdated(command: ServiceCommand<T>): void {
    Assert.notNull(command);

    using(new XLog(ReduxBaseTest.logger, levels.INFO, 'onStoreUpdated', `class: ${this.constructor.name}`), (log) => {
      log.log(`command = ${command.toString()}`);

      this._commands.push(command);
      const state = this._serviceRequests.getStoreState(command.storeId);

      if (log.isDebugEnabled()) {
        log.debug(`state = ${JSON.stringify(state)}`);
      }

      this._states.push(state);
    });
  }


  protected reset() {
    EntityVersionCache.instance.reset();
    this._commands = [];
    this._states = [];
  }


  protected getStoreState(): IServiceState {
    return this._serviceRequests.getStoreState(this.storeId);
  }
  protected getCrudState(): ICrudServiceState<T, TId> {
    return this.crudServiceRequests.getCrudState(this.storeId);
  }

  protected getCurrentItemState(): ICurrentItemServiceState<T> {
    return this.currentItemServiceRequests.getCurrentItemState(this.storeId);
  }

  protected get crudServiceRequests(): ICrudServiceRequests<T, TId> {
    return this._serviceRequests as ICrudServiceRequests<T, TId>;
  }

  protected get currentItemServiceRequests(): ICurrentItemServiceRequests<T, TId> {
    return this._serviceRequests as ICurrentItemServiceRequests<T, TId>;
  }


  protected get serviceFake(): IService<T, TId> {
    return this._serviceFake;
  }

  protected get commands(): Array<ServiceCommand<T>> {
    return this._commands;
  }

  // protected get states(): IServiceState[] {
  //   return this._states;
  // }

  protected getCrudStateAt(index: number): ICrudServiceState<T, TId> {
    return this._states[index] as ICrudServiceState<T, TId>;
  }

  protected getCurrentItemStateAt(index: number): ICurrentItemServiceState<T> {
    return this._states[index] as ICurrentItemServiceState<T>;
  }

  protected get store(): Store {
    return this._store;
  }

  private getStoreSubject(storeId: string): CustomSubject<any> {
    return this._store.subject(storeId);
  }

}