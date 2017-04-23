// tslint:disable:max-classes-per-file
// tslint:disable:member-access

import { expect } from 'chai';
import { suite, test } from 'mocha-typescript';

import { IUser } from '../../src/model';
import { ItemFoundByIdCommand } from '../../src/redux';
import { UserStore } from '../../src/redux/stores';

import { UserServiceFake } from '../../src/testing/user-service-fake';
import { UserServiceRequestsFake } from '../../src/testing/user-service-requests-fake';
import { ReduxBaseTest } from './redux-base-test.spec';


@suite('redux: misc')
class ReduxMiscTest extends ReduxBaseTest<IUser, number, any> {

  constructor() {
    super(UserStore.ID, UserServiceRequestsFake, UserServiceFake);
  }

  @test 'should test getModelClassName, getEntityId'() {
    this.serviceRequests.findById(1);

    expect(this.commands.length).to.equal(2);
    expect(this.commands[1]).to.be.instanceOf(ItemFoundByIdCommand);
    const state1 = this.states[1];

    expect(this.serviceRequests.getModelClassName()).equals(this.serviceFake.getModelClassName());
    expect(this.serviceRequests.getEntityId(state1.item)).equals(state1.item.id);
  }

}