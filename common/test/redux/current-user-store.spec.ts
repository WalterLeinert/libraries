// tslint:disable:max-classes-per-file
// tslint:disable:member-access

import { expect } from 'chai';
import { suite, test } from 'mocha-typescript';

import { NotSupportedException } from '@fluxgate/core';

import { IUser, User } from '../../src/model';

import {
  CurrentItemServiceRequests, CurrentItemSetCommand, CurrentUserStore,
  ServiceRequestStates, SettingCurrentItemCommand
} from '../../src/redux';

import { ExtendedUserServiceRequestsFake } from '../../src/testing';
import { UserServiceFake } from '../../src/testing/user-service-fake';
import { ReduxBaseTest } from './redux-base-test';


@suite('common.redux: CurrentUserStore')
class CurrentUserStoreTest extends ReduxBaseTest<IUser, number, any> {
  private user: IUser = new User(1, 'walter', 1, 'Leinert');

  constructor() {
    super(CurrentUserStore.ID, ExtendedUserServiceRequestsFake, UserServiceFake);
  }


  @test 'should dispatch commands: SetCurrentItemCommand'() {
    this.currentItemServiceRequests.setCurrent(this.user).subscribe((item) => {
      expect(this.commands.length).to.equal(2);
      expect(this.commands[0]).to.be.instanceOf(SettingCurrentItemCommand);
      expect(this.commands[1]).to.be.instanceOf(CurrentItemSetCommand);

      const state0 = this.getCurrentItemStateAt(0);
      expect(state0).to.deep.equal({
        ...CurrentItemServiceRequests.INITIAL_STATE,
        state: ServiceRequestStates.RUNNING
      });

      const state1 = this.getCurrentItemStateAt(1);
      expect(state1).to.deep.equal({
        ...CurrentItemServiceRequests.INITIAL_STATE,
        currentItem: this.user,
        state: ServiceRequestStates.DONE
      });
    });
  }


  @test 'should throw exception for commands excluding SetCurrentItemCommand'() {

    this.crudServiceRequests.create(this.user).subscribe((item) => {
      // ok
    }, (err) => {
      expect(err).to.be.instanceof(NotSupportedException);
    });

    this.crudServiceRequests.find().subscribe((items) => {
      // ok
    }, (err) => {
      expect(err).to.be.instanceof(NotSupportedException);
    });

    this.crudServiceRequests.findById(1).subscribe((item) => {
      // ok
    }, (err) => {
      expect(err).to.be.instanceOf(NotSupportedException);
    });

    this.crudServiceRequests.update(this.user).subscribe((item) => {
      // ok
    }, (err) => {
      expect(err).to.be.instanceOf(NotSupportedException);
    });

    this.crudServiceRequests.deleteById(1).subscribe((id) => {
      // ok
    }, (err) => {
      expect(err).to.be.instanceOf(NotSupportedException);
    });
  }

}