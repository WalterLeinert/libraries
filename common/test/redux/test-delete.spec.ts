// tslint:disable:max-classes-per-file
// tslint:disable:member-access

import { expect } from 'chai';
import { suite, test } from 'mocha-typescript';


import { IUser } from '../../src/model';
import { IServiceState, ServiceRequestStates } from '../../src/redux';
import { DeletingItemCommand, ItemDeletedCommand } from '../../src/redux';

import { UserServiceFake } from '../../src/testing/user-service-fake';
import { UserServiceRequestsFake } from '../../src/testing/user-service-requests-fake';
import { UserStoreFake } from '../../src/testing/user-store-fake';
import { ReduxBaseTest } from './redux-base-test.spec';


@suite('redux: delete')
class ReduxDeleteTest extends ReduxBaseTest<IUser, number, any> {
  private static readonly DELETE_ID = 1;
  private beforeState: IServiceState<IUser, number>;

  constructor() {
    super(UserStoreFake.ID, UserServiceRequestsFake, UserServiceFake);
  }


  @test 'should dispatch commands: DeletingItemCommand'() {
    expect(this.commands.length).to.equal(2);
    expect(this.commands[0]).to.be.instanceOf(DeletingItemCommand);

    const state0 = this.states[0];
    expect(state0).to.deep.equal({
      ...this.beforeState,
      state: ServiceRequestStates.RUNNING
    });
  }

  @test 'should dispatch commands: ItemDeletedCommand'() {
    expect(this.commands.length).to.equal(2);
    expect(this.commands[1]).to.be.instanceOf(ItemDeletedCommand);

    const state1 = this.states[1];
    expect(state1).to.deep.equal({
      ...this.beforeState,
      items: this.beforeState.items.filter((item) => item.id !== ReduxDeleteTest.DELETE_ID),
      deletedId: 1,
      state: ServiceRequestStates.DONE
    });
  }


  @test 'should exist one item less'(done: (err?: any) => void) {
    this.serviceFake.find().subscribe((items) => {
      if (items.length !== this.beforeState.items.length - 1) {
        done(new Error(`items.length (${items.length}) !== this.beforeState.items.length - 1` +
          ` (${this.beforeState.items.length - 1})`));
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
      this.beforeState = this.getStoreState(UserStoreFake.ID);
      this.reset();

      // Test: Item löschen
      this.serviceRequests.delete(ReduxDeleteTest.DELETE_ID);

      done();
    });
  }

}