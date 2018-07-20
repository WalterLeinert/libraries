// tslint:disable:max-classes-per-file
// tslint:disable:member-access

import { expect } from 'chai';
import { suite, test } from 'mocha-typescript';

import { Clone } from '@fluxgate/core';

import { IUser } from '../../lib/model';
import { IServiceState, ServiceRequestStates } from '../../lib/redux';
import { ItemsFoundCommand, ItemUpdatedCommand, UpdatingItemCommand } from '../../lib/redux';
import { UserStore } from '../../lib/redux/store';

import { ExtendedUserServiceRequestsFake } from '../../lib/testing';
import { UserServiceFake } from '../../lib/testing/user-service-fake';
import { ReduxBaseTest } from './redux-base-test';


@suite('common.redux: update (current)')
class UpdateCurrentTest extends ReduxBaseTest<IUser, number, any> {
  private static readonly UPDATE_ID = 1;
  private beforeState: IServiceState;
  private item: IUser;
  private itemExpected: IUser;

  constructor() {
    super(UserStore.ID, ExtendedUserServiceRequestsFake, UserServiceFake);
  }


  @test 'should update currentItem after dispatch command: UpdatingItemCommand'() {
    expect(this.commands.length).to.equal(3);
    expect(this.commands[0]).to.be.instanceOf(UpdatingItemCommand);

    const state0 = this.getCrudStateAt(0);
    expect(state0).to.deep.equal({
      ...this.beforeState,
      state: ServiceRequestStates.RUNNING
    });
  }


  @test 'should update currentItem after dispatch commands: ItemUpdated'() {
    expect(this.commands.length).to.equal(3);
    expect(this.commands[1]).to.be.instanceOf(ItemUpdatedCommand);

    const state0 = this.getCrudStateAt(0);
    const state1 = this.getCrudStateAt(1);

    expect(state1).to.deep.equal({
      ...state0,
      item: this.itemExpected,
      currentItem: this.itemExpected,
      state: ServiceRequestStates.DONE
    });
  }


  @test 'should update currentItem after dispatch commands: ItemsFound'() {
    expect(this.commands.length).to.equal(3);
    expect(this.commands[2]).to.be.instanceOf(ItemsFoundCommand);

    const state1 = this.getCrudStateAt(1);
    const state2 = this.getCrudStateAt(2);

    expect(state2).to.deep.equal({
      ...state1,
      items: state1.items.map((elem) => elem.id !== this.itemExpected.id ? elem : this.itemExpected)
    });
  }


  protected before(done: (err?: any) => void) {
    super.before(() => {

      // state.items erzeugen
      this.crudServiceRequests.find().subscribe((items) => {

        this.serviceFake.findById(UpdateCurrentTest.UPDATE_ID).subscribe((findByIdResult) => {
          this.item = findByIdResult.item;

          // currentItem setzen -> nach update prüfen
          this.currentItemServiceRequests.setCurrent(findByIdResult.item).subscribe((it) => {
            // snapshot vom Status
            this.beforeState = this.getStoreState();

            this.reset();

            this.itemExpected = Clone.clone(this.item);
            const itemToUpdate = Clone.clone(this.item);
            itemToUpdate.username = findByIdResult.item.username + '-updated';

            this.itemExpected.username = itemToUpdate.username;
            this.itemExpected.__version++;

            // Test: update item
            this.crudServiceRequests.update(itemToUpdate).subscribe(() => {
              done();
            });

          });
        });

      }, (error) => {
        done(error);
      });
    });

  }
}