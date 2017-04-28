// tslint:disable:max-classes-per-file
// tslint:disable:member-access

import { expect } from 'chai';
import { suite, test } from 'mocha-typescript';

import { Clone } from '@fluxgate/core';

import { IUser } from '../../src/model';
import { IServiceState, ServiceRequestStates } from '../../src/redux';
import { ItemUpdatedCommand, UpdatingItemCommand } from '../../src/redux';
import { UserStore } from '../../src/redux/store';

import { ExtendedUserServiceRequestsFake } from '../../src/testing';
import { UserServiceFake } from '../../src/testing/user-service-fake';
import { ReduxBaseTest } from './redux-base-test.spec';


@suite('redux: update (current)')
class UpdateCurrentTest extends ReduxBaseTest<IUser, number, any> {
  private static readonly UPDATE_ID = 1;
  private beforeState: IServiceState;
  private item: IUser;

  constructor() {
    super(UserStore.ID, ExtendedUserServiceRequestsFake, UserServiceFake);
  }


  @test 'should update currentItem after dispatch commands: UpdatingItemCommand, ItemUpdatedCommand'() {
    const itemExpected = Clone.clone(this.item);
    const item = Clone.clone(this.item);
    item.username = item.username + '-updated';

    itemExpected.username = item.username;
    itemExpected.__version++;

    this.crudServiceRequests.update(item);

    expect(this.commands.length).to.equal(2);
    expect(this.commands[0]).to.be.instanceOf(UpdatingItemCommand);

    const state0 = this.getCrudStateAt(0);
    expect(state0).to.deep.equal({
      ...this.beforeState,
      state: ServiceRequestStates.RUNNING
    });

    expect(this.commands[1]).to.be.instanceOf(ItemUpdatedCommand);

    const state1 = this.getCrudStateAt(1);

    const expectedState: IServiceState = {
      ...this.beforeState,
      item: itemExpected,
      currentItem: itemExpected,
      state: ServiceRequestStates.DONE
    };

    return expect(state1).to.deep.equal(expectedState);
  }


  protected before(done: (err?: any) => void) {
    super.before(() => {
      this.serviceFake.findById(UpdateCurrentTest.UPDATE_ID).subscribe((item) => {
        this.item = item;

        // currentItem setzen -> nach update prüfen
        this.currentItemServiceRequests.setCurrent(item);
        // snapshot vom Status
        this.beforeState = this.getStoreState();

        this.reset();

        done();
      }, (error) => {
        done(error);
      });
    });

  }
}