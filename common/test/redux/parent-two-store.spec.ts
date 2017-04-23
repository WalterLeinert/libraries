// tslint:disable:max-classes-per-file
// tslint:disable:member-access

import { expect } from 'chai';
import { suite, test } from 'mocha-typescript';

import { IRole } from '../../src/model';
import {
  CommandStore, IServiceState, ReduxParentStore,
  ServiceCommand, ServiceRequests, Store
} from '../../src/redux';
import { RoleStore } from '../../src/redux/stores';
import { RoleServiceFake } from '../../src/testing/role-service-fake';
import { ReduxBaseTest } from './redux-base-test.spec';



@ReduxParentStore(() => RoleStore)
export class RoleSelectorStore1 extends CommandStore<IServiceState<IRole, number>> {
  public static ID = 'roleSelectorStore1';

  constructor(parent?: CommandStore<IServiceState<IRole, number>>) {
    super(RoleSelectorStore1.ID, ServiceCommand.INITIAL_STATE, parent);
  }
}

@ReduxParentStore(() => RoleStore)
export class RoleSelectorStore2 extends CommandStore<IServiceState<IRole, number>> {
  public static ID = 'roleSelectorStore2';

  constructor(parent?: CommandStore<IServiceState<IRole, number>>) {
    super(RoleSelectorStore2.ID, ServiceCommand.INITIAL_STATE, parent);
  }
}


export class MyRoleServiceRequestsFake extends ServiceRequests<IRole, number, RoleServiceFake> {
  constructor(storeId: string, service: RoleServiceFake, store: Store) {
    super(storeId, service, store);
  }
}


@suite('redux: 2 child stores')
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