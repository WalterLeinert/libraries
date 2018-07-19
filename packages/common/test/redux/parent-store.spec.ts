// tslint:disable:max-classes-per-file
// tslint:disable:member-access
// tslint:disable:no-unused-expression

import { expect } from 'chai';
import { suite, test } from 'mocha-typescript';

import { IUser } from '../../src/model';
import {
  CommandStore, CurrentItemSetCommand, ExtendedCrudServiceRequests, FindingItemByIdCommand, IExtendedCrudServiceState,
  IServiceState,
  ItemFoundByIdCommand, ReduxParentStore, ServiceRequestStates, SettingCurrentItemCommand
} from '../../src/redux';
import { UserStore } from '../../src/redux/store';

import { ExtendedUserServiceRequestsFake } from '../../src/testing';
import { UserServiceFake } from '../../src/testing/user-service-fake';
import { ReduxBaseTest } from './redux-base-test';


/**
 * SelectorStore, der auf dem UserStore als Parent basiert
 *
 * @export
 * @class UserSelectorStore
 * @extends {CommandStore<IServiceState<IUser, number>>}
 */
@ReduxParentStore(() => UserStore)
export class UserSelectorStore extends CommandStore<IExtendedCrudServiceState<IUser, number>> {
  public static ID = 'userSelector';

  constructor(parent?: CommandStore<IExtendedCrudServiceState<IUser, number>>) {
    super(UserSelectorStore.ID, ExtendedCrudServiceRequests.INITIAL_STATE, parent);
  }
}


@suite('common.redux: parentStore')
class ParentStoreTest extends ReduxBaseTest<IUser, number, any> {
  private beforeState: IServiceState;
  private beforeParentState: IServiceState;

  constructor() {
    super(UserSelectorStore.ID, ExtendedUserServiceRequestsFake, UserServiceFake);
  }


  @test 'should have stores with parent/child relationship'() {
    const userStore = this.store.getCommandStore(UserStore.ID);
    expect(userStore.containsChild(UserSelectorStore.ID)).to.be.true;

    const userSelectorStore = userStore.getChild(UserSelectorStore.ID);
    expect(userSelectorStore.parent).to.equal(userStore);
  }


  @test 'should dispatch commands on child store: FindingItemByIdCommand, ItemFoundCommand, ... SetCurrentItem'() {
    expect(this.commands.length).to.equal(4);

    expect(this.commands[0]).to.be.instanceOf(FindingItemByIdCommand);
    const state0 = this.getCrudStateAt(0);

    expect(state0).to.deep.equal({
      ...this.beforeState,
      state: ServiceRequestStates.RUNNING
    });


    expect(this.commands[1]).to.be.instanceOf(ItemFoundByIdCommand);
    const state1 = this.getCrudStateAt(1);

    expect(state1).to.deep.equal({
      ...state0,
      item: state1.item,
      state: ServiceRequestStates.DONE
    });


    expect(this.commands[2]).to.be.instanceOf(SettingCurrentItemCommand);
    const state2 = this.getCurrentItemStateAt(2);

    expect(state2).to.deep.equal({
      ...state1,
      state: ServiceRequestStates.RUNNING
    });


    expect(this.commands[3]).to.be.instanceOf(CurrentItemSetCommand);
    const state3 = this.getCurrentItemStateAt(3);

    expect(state3).to.deep.equal({
      ...state2,
      currentItem: state1.item,
      state: ServiceRequestStates.DONE
    });
  }



  @test 'should dispatch commands on parent store: FindingItemByIdCommand'() {
    expect(this.parentCommands.length).to.equal(2);

    expect(this.parentCommands[0]).to.be.instanceOf(FindingItemByIdCommand);
    const state0 = this.getParentCrudStateAt(0);

    expect(state0).to.deep.equal({
      ...this.beforeParentState,
      state: ServiceRequestStates.RUNNING
    });
  }

  @test 'should dispatch commands on parent store: ItemFoundCommand'() {
    expect(this.parentCommands.length).to.equal(2);

    const state0 = this.getParentCrudStateAt(0);

    expect(this.parentCommands[1]).to.be.instanceOf(ItemFoundByIdCommand);
    const state1 = this.getParentCrudStateAt(1);

    expect(state1).to.deep.equal({
      ...state0,
      item: state1.item,
      state: ServiceRequestStates.DONE
    });
  }


  protected before(done: (err?: any) => void) {
    super.before(() => {

      // snapshot vom Status
      this.beforeState = this.getStoreState();
      this.beforeParentState = this.getStoreState(this.parentStoreId);

      this.reset();

      this.crudServiceRequests.findById(1).subscribe((item: IUser) => {
        this.currentItemServiceRequests.setCurrent(item).subscribe((it) => {
          done();
        });
      });
    });
  }
}