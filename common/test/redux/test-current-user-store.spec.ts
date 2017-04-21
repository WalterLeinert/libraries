// tslint:disable:max-classes-per-file
// tslint:disable:member-access

import { expect } from 'chai';
import { suite, test } from 'mocha-typescript';

import { NotSupportedException } from '@fluxgate/core';

import { IUser, User } from '../../src/model';
import { CurrentUserStore } from '../../src/redux';
import { ServiceCommand, SetCurrentItemCommand } from '../../src/redux';

import { UserServiceFake } from '../../src/testing/user-service-fake';
import { UserServiceRequestsFake } from '../../src/testing/user-service-requests-fake';
import { ReduxBaseTest } from './redux-base-test.spec';


@suite('redux: CurrentUserStore')
class CurrentUserStoreTest extends ReduxBaseTest<IUser, number, any> {
  private user: IUser = new User(1, 'walter', 1, 'Leinert');

  constructor() {
    super(CurrentUserStore.ID, UserServiceRequestsFake, UserServiceFake);
  }


  @test 'should dispatch commands: SetCurrentItemCommand'() {
    this.serviceRequests.setCurrent(this.user);

    expect(this.commands.length).to.equal(1);
    expect(this.commands[0]).to.be.instanceOf(SetCurrentItemCommand);

    const state0 = this.states[0];
    expect(state0).to.deep.equal({
      ...ServiceCommand.INITIAL_STATE,
      currentItem: this.user
    });
  }


  @test 'should throw exception for commands excluding SetCurrentItemCommand'() {
    expect(() => this.serviceRequests.create(this.user)).to.Throw(NotSupportedException);
    expect(() => this.serviceRequests.find()).to.Throw(NotSupportedException);
    expect(() => this.serviceRequests.findById(1)).to.Throw(NotSupportedException);
    expect(() => this.serviceRequests.update(this.user)).to.Throw(NotSupportedException);
    expect(() => this.serviceRequests.delete(1)).to.Throw(NotSupportedException);
  }

}