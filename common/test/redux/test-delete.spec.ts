// tslint:disable:max-classes-per-file
// tslint:disable:member-access

import { expect } from 'chai';
import { only, suite, test } from 'mocha-typescript';


import { IUser } from '../../src/model';
import { IServiceState, ServiceCommand, ServiceRequestStates } from '../../src/redux';
import { DeletingItemCommand, ItemDeletedCommand } from '../../src/redux';

import { ReduxBaseTest } from './redux-base-test.spec';
import { UserServiceFake } from './user-service-fake';
import { UserServiceRequests } from './user-service-requests';
import { UserStore } from './user-store';


@suite('redux: delete')
class ReduxDeleteTest extends ReduxBaseTest<IUser, number, any> {
  private static readonly DELETE_ID = 1;
  private findState: IServiceState<IUser, number>;

  constructor() {
    super(UserStore.ID, UserServiceRequests, UserServiceFake);
  }


  @test 'should dispatch commands: DeletingItemCommand, ItemDeletedCommand'() {
    this.serviceRequests.delete(ReduxDeleteTest.DELETE_ID);

    expect(this.commands.length).to.equal(2);
    expect(this.commands[0]).to.be.instanceOf(DeletingItemCommand);

    const state0 = this.states[0];
    expect(state0).to.deep.equal({
      ...ServiceCommand.INITIAL_STATE,
      items: this.findState.items,
      state: ServiceRequestStates.RUNNING
    });

    expect(this.commands[1]).to.be.instanceOf(ItemDeletedCommand);

    const state1 = this.states[1];
    expect(state1).to.deep.equal({
      ...ServiceCommand.INITIAL_STATE,
      items: this.findState.items.filter((item) => item.id !== ReduxDeleteTest.DELETE_ID),
      deletedId: 1,
      state: ServiceRequestStates.DONE
    });

  }

  protected before(done: (err?: any) => void) {
    super.before(() => {
      this.serviceRequests.find();
      this.findState = this.getStoreState(UserStore.ID);

      this.reset();
      done();
    });

  }

}