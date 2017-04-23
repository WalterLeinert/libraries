// tslint:disable:max-classes-per-file
// tslint:disable:member-access

import { expect } from 'chai';
import { suite, test } from 'mocha-typescript';

import { Clone } from '@fluxgate/core';

import { IUser } from '../../src/model';
import { IServiceState, ServiceCommand, ServiceRequestStates } from '../../src/redux';
import { ItemUpdatedCommand, UpdatingItemCommand } from '../../src/redux';
import { UserStore } from '../../src/redux/stores';

import { UserServiceFake } from '../../src/testing/user-service-fake';
import { UserServiceRequestsFake } from '../../src/testing/user-service-requests-fake';
import { ReduxBaseTest } from './redux-base-test.spec';


@suite('redux: update')
class UpdateTest extends ReduxBaseTest<IUser, number, any> {
  private static readonly UPDATE_ID = 1;
  private item: IUser;

  constructor() {
    super(UserStore.ID, UserServiceRequestsFake, UserServiceFake);
  }


  @test 'should dispatch commands: UpdatingItemCommand, ItemUpdatedCommand'() {
    const itemExpected = Clone.clone(this.item);
    const item = Clone.clone(this.item);
    item.username = item.username + '-updated';

    itemExpected.username = item.username;
    itemExpected.__version++;

    this.serviceRequests.update(item);

    expect(this.commands.length).to.equal(2);
    expect(this.commands[0]).to.be.instanceOf(UpdatingItemCommand);

    const state0 = this.states[0];
    expect(state0).to.deep.equal({
      ...ServiceCommand.INITIAL_STATE,
      state: ServiceRequestStates.RUNNING
    });

    expect(this.commands[1]).to.be.instanceOf(ItemUpdatedCommand);

    const state1 = this.states[1];

    const expectedState: IServiceState<IUser, number> = {
      ...ServiceCommand.INITIAL_STATE,
      item: itemExpected,
      state: ServiceRequestStates.DONE
    };

    return expect(state1).to.deep.equal(expectedState);
  }


  protected before(done: (err?: any) => void) {
    super.before(() => {
      this.serviceFake.findById(UpdateTest.UPDATE_ID).subscribe((item) => {
        this.item = item;
        done();
      }, (error) => {
        done(error);
      });
    });

  }
}