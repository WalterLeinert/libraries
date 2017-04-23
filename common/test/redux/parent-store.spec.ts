// tslint:disable:max-classes-per-file
// tslint:disable:member-access

require('reflect-metadata');

import { expect } from 'chai';
import { suite, test } from 'mocha-typescript';

import { IUser } from '../../src/model';
import { CommandStore, IServiceState, ReduxParentStore, ServiceCommand } from '../../src/redux';
import { UserStore } from '../../src/redux/stores';

import { UserServiceFake } from '../../src/testing/user-service-fake';
import { UserServiceRequestsFake } from '../../src/testing/user-service-requests-fake';
import { ReduxBaseTest } from './redux-base-test.spec';

@ReduxParentStore(() => UserStore)
export class UserSelectorStore extends CommandStore<IServiceState<IUser, number>> {
  public static ID = 'roleSelectorStore';

  constructor(parent?: CommandStore<IServiceState<IUser, number>>) {
    super(UserSelectorStore.ID, ServiceCommand.INITIAL_STATE, parent);
  }
}


@suite('redux: parentStore')
class ParentStoreTest extends ReduxBaseTest<IUser, number, any> {

  constructor() {
    super(UserSelectorStore.ID, UserServiceRequestsFake, UserServiceFake);
  }


  @test 'should have parentStore'() {
    const commandStore = this.store.getCommandStore(UserSelectorStore.ID)
    expect(commandStore.parent).to.exist;

    expect(commandStore.parent.name).to.equal(UserStore.ID);
  }

}