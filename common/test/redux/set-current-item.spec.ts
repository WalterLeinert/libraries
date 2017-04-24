// tslint:disable:max-classes-per-file
// tslint:disable:member-access

import { expect } from 'chai';
import { only, suite, test } from 'mocha-typescript';


import { IUser, User } from '../../src/model';
import { CurrentUserStore, ICurrentItemServiceState } from '../../src/redux';
import { SetCurrentItemCommand } from '../../src/redux';

import { CurrentUserServiceRequestsFake } from '../../src/testing/current-user-service-requests-fake';
import { UserServiceFake } from '../../src/testing/user-service-fake';
import { ReduxBaseTest } from './redux-base-test.spec';


@suite('redux: set current item')
class SetCurrentTest extends ReduxBaseTest<IUser, number, any> {
  private beforeState: ICurrentItemServiceState<IUser, number>;
  private user: IUser = new User(1, 'walter');

  constructor() {
    super(CurrentUserStore.ID, CurrentUserServiceRequestsFake, UserServiceFake);
  }


  @test 'should dispatch commands: SetCurrentItemCommand'() {
    expect(this.commands.length).to.equal(1);
    expect(this.commands[0]).to.be.instanceOf(SetCurrentItemCommand);

    const state0 = this.getCurrentItemStateAt(0);
    expect(state0).to.deep.equal({
      ...this.beforeState,
      currentItem: this.user
    });
  }


  protected before(done: (err?: any) => void) {
    super.before(() => {

      this.user = new User(1, 'walter');

      //
      // before-Status erzeugen
      //
      this.beforeState = this.getCurrentItemState();
      this.reset();


      // Test: user als current setzen
      this.currentItemServiceRequests.setCurrent(this.user);

      done();
    });
  }

}