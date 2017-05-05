// tslint:disable:max-classes-per-file
// tslint:disable:member-access

import { expect } from 'chai';
import { suite, test } from 'mocha-typescript';


import { IUser } from '../../src/model';
import { ICrudServiceState, ServiceRequestStates } from '../../src/redux';
import { DeletingItemCommand, ItemDeletedCommand } from '../../src/redux';
import { UserStore } from '../../src/redux/store';

import { UserServiceFake } from '../../src/testing/user-service-fake';
import { UserServiceRequestsFake } from '../../src/testing/user-service-requests-fake';
import { ReduxBaseTest } from './redux-base-test.spec';


@suite('common.redux: delete')
class DeleteTest extends ReduxBaseTest<IUser, number, any> {
  private static readonly DELETE_ID = 1;
  private beforeState: ICrudServiceState<IUser, number>;

  constructor() {
    super(UserStore.ID, UserServiceRequestsFake, UserServiceFake);
  }


  @test 'should dispatch commands: DeletingItemCommand'() {
    expect(this.commands.length).to.equal(2);
    expect(this.commands[0]).to.be.instanceOf(DeletingItemCommand);

    const state0 = this.getCrudStateAt(0);
    expect(state0).to.deep.equal({
      ...this.beforeState,
      state: ServiceRequestStates.RUNNING
    });
  }

  @test 'should dispatch commands: ItemDeletedCommand'() {
    expect(this.commands.length).to.equal(2);
    expect(this.commands[1]).to.be.instanceOf(ItemDeletedCommand);

    const state1 = this.getCrudStateAt(1);
    expect(state1).to.deep.equal({
      ...this.beforeState,
      items: this.beforeState.items.filter((item) => item.id !== DeleteTest.DELETE_ID),
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
      this.crudServiceRequests.find().subscribe((items) => {
        this.beforeState = this.getCrudState();
        this.reset();

        // Test: Item löschen
        this.crudServiceRequests.delete(DeleteTest.DELETE_ID).subscribe((id) => {
          done();
        });
      });
    });
  }

}