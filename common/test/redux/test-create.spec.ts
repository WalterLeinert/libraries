// tslint:disable:max-classes-per-file
// tslint:disable:member-access

import { expect } from 'chai';
import { suite, test } from 'mocha-typescript';

import { Clone } from '@fluxgate/core';

import { IUser } from '../../src/model';
import { IServiceState, ServiceRequestStates } from '../../src/redux';
import { CreatingItemCommand, ItemCreatedCommand } from '../../src/redux';
import { UserStore } from '../../src/redux/stores';

import { UserServiceFake } from '../../src/testing/user-service-fake';
import { UserServiceRequestsFake } from '../../src/testing/user-service-requests-fake';
import { ReduxBaseTest } from './redux-base-test.spec';


@suite('redux: create')
class ReduxCreateTest extends ReduxBaseTest<IUser, number, any> {
  private beforeState: IServiceState<IUser, number>;
  private itemCloned: IUser;

  constructor() {
    super(UserStore.ID, UserServiceRequestsFake, UserServiceFake);
  }


  @test 'should dispatch commands: CreatingItemCommand'() {
    expect(this.commands.length).to.equal(2);
    expect(this.commands[0]).to.be.instanceOf(CreatingItemCommand);

    const state0 = this.states[0];
    expect(state0).to.deep.equal({
      ...this.beforeState,
      state: ServiceRequestStates.RUNNING
    });
  }

  @test 'should dispatch commands: ItemCreatedCommand'() {
    expect(this.commands.length).to.equal(2);
    expect(this.commands[1]).to.be.instanceOf(ItemCreatedCommand);

    const state1 = this.states[1];
    expect(state1).to.deep.equal({
      ...this.beforeState,
      items: [...this.beforeState.items, state1.item],
      item: state1.item,
      state: ServiceRequestStates.DONE
    });
  }


  @test 'should exist one more item'(done: (err?: any) => void) {
    this.serviceFake.find().subscribe((items) => {
      if (items.length !== this.beforeState.items.length + 1) {
        done(new Error(`items.length (${items.length}) !== this.beforeState.items.length + 1` +
          ` (${this.beforeState.items.length + 1})`));
      } else {
        done();
      }
    });
  }


  protected before(done: (err?: any) => void) {
    super.before(() => {
      //
      // before-Status erzeugen
      //
      this.serviceRequests.find();
      this.beforeState = this.getStoreState(UserStore.ID);
      this.reset();

      // Test: neues Item erzeugen
      this.itemCloned = Clone.clone(this.beforeState.items[0]);
      this.itemCloned.id = undefined;

      this.serviceRequests.create(this.itemCloned);

      done();
    });
  }
}