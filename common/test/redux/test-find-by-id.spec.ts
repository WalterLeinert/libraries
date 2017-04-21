// tslint:disable:max-classes-per-file
// tslint:disable:member-access

import { expect } from 'chai';
import { suite, test } from 'mocha-typescript';


import { IUser } from '../../src/model';
import { ServiceCommand, ServiceRequestStates } from '../../src/redux';
import { FindingItemByIdCommand, ItemFoundByIdCommand } from '../../src/redux';

import { UserServiceFake } from '../../src/testing/user-service-fake';
import { UserServiceRequestsFake } from '../../src/testing/user-service-requests-fake';
import { UserStoreFake } from '../../src/testing/user-store-fake';
import { ReduxBaseTest } from './redux-base-test.spec';


@suite('redux: findById')
class ReduxFindByIdTest extends ReduxBaseTest<IUser, number, any> {

  constructor() {
    super(UserStoreFake.ID, UserServiceRequestsFake, UserServiceFake);
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