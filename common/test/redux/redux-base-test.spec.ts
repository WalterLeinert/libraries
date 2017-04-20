// tslint:disable:member-access

// tslint:disable-next-line:no-var-requires
require('reflect-metadata');

import { Subscription } from 'rxjs/Subscription';


// -------------------------- logging -------------------------------
// tslint:disable-next-line:no-unused-variable
import { getLogger, ILogger, levels, using, XLog } from '@fluxgate/platform';
// -------------------------- logging -------------------------------

import { Assert, CustomSubject, ICtor } from '@fluxgate/core';

import { IEntity } from '../../src/model';
import { IService } from '../../src/model/service/service.interface';
import { ServiceCommand } from '../../src/redux/service-command';
import { IServiceState } from '../../src/redux/service-state.interface';
import { Store } from '../../src/redux/store';

import { ServiceRequests } from '../../src/redux';
import { CommonTest } from '../common.spec';


export class ReduxBaseTest<T extends IEntity<TId>, TId, TService extends IService<T, TId>> extends CommonTest {
  protected static readonly logger = getLogger(ReduxBaseTest);

  private store: Store;
  private _serviceFake: TService;
  private _serviceRequests: ServiceRequests<T, TId, TService>;
  private subscriptions: Subscription[] = [];
  private _commands: Array<ServiceCommand<T, TId>> = [];
  private _states: Array<IServiceState<T, TId>> = [];

  protected constructor(private storeId: string, private serviceRequestClazz: ICtor<ServiceRequests<T, TId, TService>>,
    private serviceClazz: ICtor<TService>) {
    super();
  }


  protected before(done: (err?: any) => void) {
    this.store = new Store();
    this._serviceFake = new this.serviceClazz();
    this._serviceRequests = new this.serviceRequestClazz(this._serviceFake, this.store);

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

  protected onStoreUpdated(command: ServiceCommand<T, TId>): void {
    Assert.notNull(command);

    using(new XLog(ReduxBaseTest.logger, levels.INFO, 'onStoreUpdated', `class: ${this.constructor.name}`), (log) => {
      log.log(`command = ${command.constructor.name}: ${JSON.stringify(command)}`);

      this._commands.push(command);
      const state = this.getStoreState(command.storeId);
      this._states.push(state);
    });
  }


  protected reset() {
    this._commands = [];
    this._states = [];
  }

  protected getStoreState(storeId: string): IServiceState<T, TId> {
    return this.store.getState<IServiceState<T, TId>>(storeId);
  }

  protected get serviceRequests(): ServiceRequests<T, TId, TService> {
    return this._serviceRequests;
  }

  protected get serviceFake(): IService<T, TId> {
    return this._serviceFake;
  }

  protected get commands(): Array<ServiceCommand<T, TId>> {
    return this._commands;
  }

  protected get states(): Array<IServiceState<T, TId>> {
    return this._states;
  }

  private getStoreSubject(storeId: string): CustomSubject<any> {
    return this.store.subject(storeId);
  }

}