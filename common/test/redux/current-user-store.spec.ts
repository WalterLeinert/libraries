// tslint:disable:max-classes-per-file
// tslint:disable:member-access

import { expect } from 'chai';
import { only, suite, test } from 'mocha-typescript';

import { NotSupportedException } from '@fluxgate/core';

import { IUser, User } from '../../src/model';

import {
  CurrentItemServiceRequests, CurrentUserStore, SetCurrentItemCommand
} from '../../src/redux';

import { ExtendedUserServiceRequestsFake } from '../../src/testing';
import { UserServiceFake } from '../../src/testing/user-service-fake';
import { ReduxBaseTest } from './redux-base-test.spec';


@suite('redux: CurrentUserStore') @only
class CurrentUserStoreTest extends ReduxBaseTest<IUser, number, any> {
  private user: IUser = new User(1, 'walter', 1, 'Leinert');

  constructor() {
    super(CurrentUserStore.ID, ExtendedUserServiceRequestsFake, UserServiceFake);
  }


  @test 'should dispatch commands: SetCurrentItemCommand'() {
    this.currentItemServiceRequests.setCurrent(this.user);

    expect(this.commands.length).to.equal(1);
    expect(this.commands[0]).to.be.instanceOf(SetCurrentItemCommand);

    const state0 = this.getCurrentItemStateAt(0);
    expect(state0).to.deep.equal({
      ...CurrentItemServiceRequests.INITIAL_STATE,
      currentItem: this.user
    });
  }


  @test 'should throw exception for commands excluding SetCurrentItemCommand'() {
    expect(() => this.crudServiceRequests.create(this.user)).to.Throw(NotSupportedException);
    expect(() => this.crudServiceRequests.find()).to.Throw(NotSupportedException);
    expect(() => this.crudServiceRequests.findById(1)).to.Throw(NotSupportedException);
    expect(() => this.crudServiceRequests.update(this.user)).to.Throw(NotSupportedException);
    expect(() => this.crudServiceRequests.delete(1)).to.Throw(NotSupportedException);
  }

}