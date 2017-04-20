// tslint:disable:max-classes-per-file
// tslint:disable:member-access

import { expect } from 'chai';
import { only, suite, test } from 'mocha-typescript';


import { IUser } from '../../src/model';
import { ServiceCommand, ServiceRequestStates } from '../../src/redux';
import { CreatingItemCommand, ItemCreatedCommand } from '../../src/redux';

import { ReduxBaseTest } from './redux-base-test.spec';
import { UserServiceFake } from './user-service-fake';
import { UserServiceRequests } from './user-service-requests';
import { UserStore } from './user-store';


@suite('redux: create')
class ReduxCreateTest extends ReduxBaseTest<IUser, number, any> {
  private item: IUser;

  constructor() {
    super(UserStore.ID, UserServiceRequests, UserServiceFake);
  }


  @test 'should dispatch commands: CreatingItemCommand, ItemCreatedCommand'() {
    this.serviceRequests.create(this.item);

    expect(this.commands.length).to.equal(2);
    expect(this.commands[0]).to.be.instanceOf(CreatingItemCommand);

    const state0 = this.states[0];
    expect(state0).to.deep.equal({
      ...ServiceCommand.INITIAL_STATE,
      state: ServiceRequestStates.RUNNING
    });

    expect(this.commands[1]).to.be.instanceOf(ItemCreatedCommand);

    const state1 = this.states[1];
    expect(state1).to.deep.equal({
      ...ServiceCommand.INITIAL_STATE,
      item: this.item,
      state: ServiceRequestStates.DONE
    });

  }

  protected before(done: (err?: any) => void) {
    super.before(() => {
      this.serviceFake.findById(1).subscribe((item) => {
        this.item = item;
        done();
      }, (error) => {
        done(error);
      });
    });

  }

}