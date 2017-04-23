// tslint:disable:max-classes-per-file
// tslint:disable:member-access

import { expect } from 'chai';
import { suite, test } from 'mocha-typescript';


import { IUser } from '../../src/model';
import { ServiceCommand, ServiceRequestStates } from '../../src/redux';
import { FindingItemsCommand, ItemsFoundCommand } from '../../src/redux';
import { UserStore } from '../../src/redux/stores';

import { UserServiceFake } from '../../src/testing/user-service-fake';
import { UserServiceRequestsFake } from '../../src/testing/user-service-requests-fake';
import { ReduxBaseTest } from './redux-base-test.spec';


@suite('redux: find')
class FindTest extends ReduxBaseTest<IUser, number, any> {

  constructor() {
    super(UserStore.ID, UserServiceRequestsFake, UserServiceFake);
  }

  @test 'should test initial state'() {
    const state = this.getStoreState(UserStore.ID);
    expect(state).to.deep.equal(ServiceCommand.INITIAL_STATE);
  }

  @test 'should dispatch commands: FindingItemsCommand, ItemsFoundCommand'() {
    this.serviceRequests.find();

    expect(this.commands.length).to.equal(2);
    expect(this.commands[0]).to.be.instanceOf(FindingItemsCommand);

    const state0 = this.states[0];
    expect(state0).to.deep.equal({
      ...ServiceCommand.INITIAL_STATE,
      state: ServiceRequestStates.RUNNING
    });

    expect(this.commands[1]).to.be.instanceOf(ItemsFoundCommand);

    const state1 = this.states[1];
    expect(state1).to.deep.equal({
      ...ServiceCommand.INITIAL_STATE,
      items: state1.items,
      state: ServiceRequestStates.DONE
    });

  }

}