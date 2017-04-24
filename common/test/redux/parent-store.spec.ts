// tslint:disable:max-classes-per-file
// tslint:disable:member-access

import { expect } from 'chai';
import { suite, test } from 'mocha-typescript';

import { IUser } from '../../src/model';
import {
  CommandStore, ExtendedCrudServiceRequests, FindingItemByIdCommand, IExtendedCrudServiceState,
  IServiceState,
  ItemFoundByIdCommand, ReduxParentStore, ServiceRequestStates, Store
} from '../../src/redux';
import { UserStore } from '../../src/redux/store';

import { ExtendedUserServiceRequestsFake } from '../../src/testing';
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
export class UserSelectorStore extends CommandStore<IExtendedCrudServiceState<IUser, number>> {
  public static ID = 'userSelectorStore';

  constructor(parent?: CommandStore<IExtendedCrudServiceState<IUser, number>>) {
    super(UserSelectorStore.ID, ExtendedCrudServiceRequests.INITIAL_STATE, parent);
  }
}


@suite('redux: parentStore')
class ParentStoreTest extends ReduxBaseTest<IUser, number, any> {
  private beforeState: IServiceState;

  constructor() {
    super(UserSelectorStore.ID, ExtendedUserServiceRequestsFake, UserServiceFake);
  }


  @test 'should have stores with parent/child relationship'() {
    const userStore = this.store.getCommandStore(UserStore.ID);
    expect(userStore.containsChild(UserSelectorStore.ID)).to.be.true;

    const userSelectorStore = userStore.getChild(UserSelectorStore.ID);
    expect(userSelectorStore.parent).to.equal(userStore);
  }


  @test 'should dispatch commands: FindingItemByIdCommand, ItemFoundCommand'() {
    expect(this.commands.length).to.equal(2);
    expect(this.commands[0]).to.be.instanceOf(FindingItemByIdCommand);

    const state0 = this.getCrudStateAt(0);
    expect(state0).to.deep.equal(this.beforeState);

    expect(this.commands[1]).to.be.instanceOf(ItemFoundByIdCommand);

    const state1 = this.getCrudStateAt[1];
    expect(state1).to.deep.equal({
      ...this.beforeState,
      item: state1.item,
      state: ServiceRequestStates.DONE
    });
  }


  protected before(done: (err?: any) => void) {
    super.before(() => {

      // snapshot vom Status
      this.beforeState = this.getStoreState(UserStore.ID);
      this.reset();

      this.crudServiceRequests.findById(1);

      done();
    });
  }
}