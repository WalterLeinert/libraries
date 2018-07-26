// tslint:disable:max-classes-per-file
// tslint:disable:no-unused-expression
// tslint:disable:member-access

import { expect } from 'chai';
import { suite, test } from 'mocha-typescript';

import { Assert, Funktion } from '@fluxgate/core';

import { IRole } from '../../lib/model';
import {
  CommandStore, IServiceState, ReduxParentStore, ServiceRequests, Store
} from '../../lib/redux';
import { RoleStore } from '../../lib/redux/store';
import { RoleServiceFake } from '../../lib/testing/role-service-fake';
import { ReduxBaseTest } from './redux-base-test';



@ReduxParentStore(() => RoleStore)
export class RoleSelectorStore1 extends CommandStore<IServiceState> {
  public static ID = 'roleSelector1';

  constructor(parent?: CommandStore<IServiceState>) {
    super(RoleSelectorStore1.ID, ServiceRequests.INITIAL_STATE, parent);
  }
}

@ReduxParentStore(() => RoleStore)
export class RoleSelectorStore2 extends CommandStore<IServiceState> {
  public static ID = 'roleSelector2';

  constructor(parent?: CommandStore<IServiceState>) {
    super(RoleSelectorStore2.ID, ServiceRequests.INITIAL_STATE, parent);
  }
}


export class MyRoleServiceRequestsFake extends ServiceRequests {
  constructor(storeId: string, service: RoleServiceFake, store: Store) {
    super(storeId, store);
  }
}


@suite('common.redux: 2 child stores')
class ChildStoreTest extends ReduxBaseTest<IRole, number, any> {

  constructor() {
    super(RoleSelectorStore1.ID, MyRoleServiceRequestsFake, RoleServiceFake);
  }


  @test 'should have stores with parent/child relationship'() {
    const userStore = this.store.getCommandStore(RoleStore.ID);

    expect(userStore.containsChild(RoleSelectorStore1.ID)).to.be.true;
    expect(userStore.containsChild(RoleSelectorStore2.ID)).to.be.true;

    const userSelectorStore1 = userStore.getChild(RoleSelectorStore1.ID);
    expect(userSelectorStore1.parent).to.equal(userStore);

    const userSelectorStore2 = userStore.getChild(RoleSelectorStore2.ID);
    expect(userSelectorStore2.parent).to.equal(userStore);
  }

  @test 'should have 2 child stores'() {
    const userStore = this.store.getCommandStore(RoleStore.ID);
    expect(userStore.children.length).to.equal(2);
  }

}