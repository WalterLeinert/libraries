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

  private _parentCommands: Array<ServiceCommand<T>> = [];
  private _parentStates: IServiceState[] = [];

  private _entityVersionServiceFake: EntityVersionServiceFake;
  protected parentStoreId: string;

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

    const commandStore = this._store.getCommandStore(this.storeId);

    if (commandStore.parent) {
      this.parentStoreId = commandStore.parent.name;
      this.subscribeToParentStore(this.parentStoreId);
    }

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

  protected subscribeToParentStore<T, TId>(parentStoreId: string): Subscription {
    const subscription = this.getStoreSubject(parentStoreId).subscribe((command) => {
      this.onParentStoreUpdated(command);
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

  protected onParentStoreUpdated(command: ServiceCommand<T>): void {
    Assert.notNull(command);

    using(new XLog(ReduxBaseTest.logger, levels.INFO, 'onParentStoreUpdated', `class: ${this.constructor.name}`),
      (log) => {
        log.log(`command = ${command.toString()}`);

        this._parentCommands.push(command);
        const state = this.getCrudState(this.parentStoreId);

        if (log.isDebugEnabled()) {
          log.debug(`state = ${JSON.stringify(state)}`);
        }

        this._parentStates.push(state);
      });
  }


  protected reset() {
    EntityVersionCache.instance.reset();
    this._commands = [];
    this._states = [];
    this._parentCommands = [];
    this._parentStates = [];
  }


  protected getStoreState(storeId: string = this.storeId): IServiceState {
    return this._store.getState(storeId);
  }
  protected getCrudState(storeId: string = this.storeId): ICrudServiceState<T, TId> {
    return this.crudServiceRequests.getCrudState(storeId);
  }

  protected getCurrentItemState(storeId: string = this.storeId): ICurrentItemServiceState<T> {
    return this.currentItemServiceRequests.getCurrentItemState(storeId);
  }

  protected get crudServiceRequests(): ICrudServiceRequests<T, TId> {
    return this._serviceRequests as ICrudServiceRequests<T, TId>;
  }

  protected get currentItemServiceRequests(): ICurrentItemServiceRequests<T> {
    return this._serviceRequests as ICurrentItemServiceRequests<T>;
  }


  protected get serviceFake(): IService<T, TId> {
    return this._serviceFake;
  }

  protected get commands(): Array<ServiceCommand<T>> {
    return this._commands;
  }

  protected get parentCommands(): Array<ServiceCommand<T>> {
    return this._parentCommands;
  }


  protected getCrudStateAt(index: number): ICrudServiceState<T, TId> {
    return this._states[index] as ICrudServiceState<T, TId>;
  }

  protected getCurrentItemStateAt(index: number): ICurrentItemServiceState<T> {
    return this._states[index] as ICurrentItemServiceState<T>;
  }


  protected getParentCrudStateAt(index: number): ICrudServiceState<T, TId> {
    return this._parentStates[index] as ICrudServiceState<T, TId>;
  }

  protected getParentCurrentItemStateAt(index: number): ICurrentItemServiceState<T> {
    return this._parentStates[index] as ICurrentItemServiceState<T>;
  }


  protected get store(): Store {
    return this._store;
  }

  private getStoreSubject(storeId: string): CustomSubject<any> {
    return this._store.subject(storeId);
  }

}