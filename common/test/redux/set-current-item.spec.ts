// tslint:disable:max-classes-per-file
// tslint:disable:member-access

import { expect } from 'chai';
import { suite, test } from 'mocha-typescript';


import { IUser } from '../../src/model';
import { IServiceState, UserStore } from '../../src/redux';
import { SetCurrentItemCommand } from '../../src/redux';

import { UserServiceFake } from '../../src/testing/user-service-fake';
import { UserServiceRequestsFake } from '../../src/testing/user-service-requests-fake';
import { ReduxBaseTest } from './redux-base-test.spec';


@suite('redux: set current')
class SetCurrentTest extends ReduxBaseTest<IUser, number, any> {
  private static readonly CURRENT_INDEX = 2;
  private beforeState: IServiceState<IUser, number>;

  constructor() {
    super(UserStore.ID, UserServiceRequestsFake, UserServiceFake);
  }


  @test 'should dispatch commands: SetCurrentItemCommand'() {
    expect(this.commands.length).to.equal(1);
    expect(this.commands[0]).to.be.instanceOf(SetCurrentItemCommand);

    const state0 = this.states[0];
    expect(state0).to.deep.equal({
      ...this.beforeState,
      currentItem: this.beforeState.items[SetCurrentTest.CURRENT_INDEX]
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


      // Test: 2. Item als current setzen
      this.serviceRequests.setCurrent(this.beforeState.items[SetCurrentTest.CURRENT_INDEX]);

      done();
    });
  }

}