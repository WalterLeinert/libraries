// tslint:disable:max-classes-per-file
// tslint:disable:member-access

// tslint:disable-next-line:no-var-requires
require('reflect-metadata');


import { expect } from 'chai';
import { only, suite, test } from 'mocha-typescript';

import { Subscription } from 'rxjs/Subscription';

// -------------------------- logging -------------------------------
// tslint:disable-next-line:no-unused-variable
import { getLogger, ILogger, levels, using, XLog } from '@fluxgate/platform';
// -------------------------- logging -------------------------------

import { Assert, CustomSubject } from '@fluxgate/core';

import { Client, Column, IEntity, IUser, Table } from '../../src/model';
import { SetCurrentItemCommand } from '../../src/redux';
import { ServiceCommand } from '../../src/redux/service-command';
import { IServiceState } from '../../src/redux/service-state.interface';
import { Store } from '../../src/redux/store';

import { CommonTest } from '../common.spec';
import { UserServiceFake } from './user-service-fake';
import { UserServiceRequests } from './user-service-requests';
import { UserStore } from './user-store';


@Table({ name: ArtikelRedux.TABLE_NAME })
class ArtikelRedux implements IEntity<number> {
  public static readonly TABLE_NAME = 'artikel';

  @Column({ name: 'artikel_id', primary: true, generated: true })
  public id: number;

  @Column({ name: 'artikel_name', displayName: 'Name' })
  public name: string;

  @Client()
  @Column({ name: 'id_mandant' })
  public id_mandant?: number;
}



@suite('redux') @only
class ReduxTest extends CommonTest {
  protected static readonly logger = getLogger(ReduxTest);

  private store: Store;
  private serviceRequests: UserServiceRequests;
  private subscriptions: Subscription[] = [];

  @test 'should exist store and serviceRequests'() {
    expect(this.store).to.be.not.null;
    expect(this.serviceRequests).to.be.not.null;
  }

  @test 'should call find'() {
    this.serviceRequests.find();
  }


  protected before() {
    this.store = new Store();
    this.serviceRequests = new UserServiceRequests(new UserServiceFake(), this.store);
    this.subscribeToStore(UserStore.ID);
  }

  protected subscribeToStore<T, TId>(storeId: string): Subscription {
    const subscription = this.getStoreSubject(storeId).subscribe((command) => {
      this.onStoreUpdated(command);
    });
    this.subscriptions.push(subscription);
    return subscription;
  }

  protected onStoreUpdated<T extends IEntity<TId>, TId>(command: ServiceCommand<T, TId>): void {
    Assert.notNull(command);

    using(new XLog(ReduxTest.logger, levels.INFO, 'onStoreUpdated', `class: ${this.constructor.name}`), (log) => {
      log.log(`command = ${command.constructor.name}: ${JSON.stringify(command)}`);

      const state = this.getStoreState(command.storeId);
      if (state.error) {
        log.error(`${state.error}`);
      }

      if (command.storeId === UserStore.ID && command instanceof SetCurrentItemCommand) {
        this.updateUserState(command);
      }
    });
  }

  protected getStoreState<T extends IEntity<TId>, TId>(storeId: string): IServiceState<T, TId> {
    return this.store.getState<IServiceState<T, TId>>(storeId);
  }

  private updateUserState(command?: ServiceCommand<IUser, number>) {
    if (command instanceof SetCurrentItemCommand) {
      // this.currentUserChanged.emit(this.getCurrentUser());
    }
  }


  private getStoreSubject(storeId: string): CustomSubject<any> {
    return this.store.subject(storeId);
  }

}