// tslint:disable:max-classes-per-file
// tslint:disable:member-access

import { expect } from 'chai';
import { suite, test } from 'mocha-typescript';

import { IUser } from '../../src/model';
import {
  CommandStore, FindingItemByIdCommand, IServiceState, ItemFoundByIdCommand, ReduxParentStore,
  ServiceCommand, ServiceRequests, ServiceRequestStates, Store
} from '../../src/redux';
import { UserStore } from '../../src/redux/stores';

import { UserServiceFake } from '../../src/testing/user-service-fake';
import { ReduxBaseTest } from './redux-base-test.spec';


/**
 * SelectorStore, der auf dem UserStore als Parent basiert
 *
 * @export
 * @class UserSelectorStore
 * @extends {CommandStore<IServiceState<IUser, number>>}
 */
@ReduxParentStore(() => UserStore)
export class UserSelectorStore extends CommandStore<IServiceState<IUser, number>> {
  public static ID = 'userSelectorStore';

  constructor(parent?: CommandStore<IServiceState<IUser, number>>) {
    super(UserSelectorStore.ID, ServiceCommand.INITIAL_STATE, parent);
  }
}


/**
 * ServiceRequests, die auf dem UserSelectorStore arbeiten
 *
 * @export
 * @class MyUserServiceRequestsFake
 * @extends {ServiceRequests<IUser, number, UserServiceFake>}
 */
export class MyUserServiceRequestsFake extends ServiceRequests<IUser, number, UserServiceFake> {
  constructor(storeId: string, service: UserServiceFake, store: Store) {
    super(storeId, service, store);
  }
}


@suite('redux: parentStore')
class ParentStoreTest extends ReduxBaseTest<IUser, number, any> {

  constructor() {
    super(UserSelectorStore.ID, MyUserServiceRequestsFake, UserServiceFake);
  }


  @test 'should have stores with parent/child relationship'() {
    const userStore = this.store.getCommandStore(UserStore.ID);
    expect(userStore.containsChild(UserSelectorStore.ID)).to.be.true;

    const userSelectorStore = userStore.getChild(UserSelectorStore.ID);
    expect(userSelectorStore.parent).to.equal(userStore);
  }


  @test 'should dispatch commands: FindingItemByIdCommand, ItemFoundCommand'() {
    this.serviceRequests.findById(1);

    expect(this.commands.length).to.equal(2);
    expect(this.commands[0]).to.be.instanceOf(FindingItemByIdCommand);

    const state0 = this.states[0];
    expect(state0).to.deep.equal({
      ...ServiceCommand.INITIAL_STATE,
      state: ServiceRequestStates.RUNNING
    });

    expect(this.commands[1]).to.be.instanceOf(ItemFoundByIdCommand);

    const state1 = this.states[1];
    expect(state1).to.deep.equal({
      ...ServiceCommand.INITIAL_STATE,
      item: state1.item,
      state: ServiceRequestStates.DONE
    });

  }

}