// tslint:disable:max-classes-per-file
// tslint:disable:member-access

import { expect } from 'chai';
import { suite, test } from 'mocha-typescript';

import { Clone } from '@fluxgate/core';

import { IUser } from '../../lib/model/user.interface';
import { ICrudServiceState, ServiceRequestStates } from '../../lib/redux';
import { CreatingItemCommand } from '../../lib/redux/command/creating-item-command';
import { ItemCreatedCommand } from '../../lib/redux/command/item-created-command';
import { ItemsFoundCommand } from '../../lib/redux/command/items-found-command';
import { UserStore } from '../../lib/redux/store';

import { UserServiceFake } from '../../lib/testing/user-service-fake';
import { UserServiceRequestsFake } from '../../lib/testing/user-service-requests-fake';
import { ReduxBaseTest } from './redux-base-test';


@suite('common.redux: create')
class CreateTest extends ReduxBaseTest<IUser, number, any> {
  private beforeState: ICrudServiceState<IUser, number>;
  private itemCloned: IUser;

  constructor() {
    super(UserStore.ID, UserServiceRequestsFake, UserServiceFake);
  }


  @test 'should dispatch commands: CreatingItemCommand'() {
    expect(this.commands.length).to.equal(3);
    expect(this.commands[0]).to.be.instanceOf(CreatingItemCommand);

    const state0 = this.getCrudStateAt(0);
    expect(state0).to.deep.equal({
      ...this.beforeState,
      state: ServiceRequestStates.RUNNING
    });
  }

  @test 'should dispatch commands: ItemCreatedCommand'() {
    expect(this.commands.length).to.equal(3);
    expect(this.commands[1]).to.be.instanceOf(ItemCreatedCommand);

    const state0 = this.getCrudStateAt(0);
    const state1 = this.getCrudStateAt(1);
    expect(state1).to.deep.equal({
      ...state0,
      item: state1.item,
      state: ServiceRequestStates.DONE
    });
  }

  @test 'should dispatch commands: ItemsFoundCommand'() {
    expect(this.commands.length).to.equal(3);
    expect(this.commands[2]).to.be.instanceOf(ItemsFoundCommand);

    const state1 = this.getCrudStateAt(1);
    const state2 = this.getCrudStateAt(2);
    expect(state2).to.deep.equal({
      ...state1,
      items: [...state1.items, state1.item],
    });
  }


  @test 'should exist one more item'(done: (err?: any) => void) {
    this.serviceFake.find().subscribe((findResult) => {
      if (findResult.items.length !== this.beforeState.items.length + 1) {
        done(new Error(`items.length (${findResult.items.length}) !== this.beforeState.items.length + 1` +
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
      this.crudServiceRequests.find().subscribe((items) => {
        this.beforeState = super.getCrudState();
        this.reset();


        // Test: neues Item erzeugen
        this.itemCloned = Clone.clone(this.beforeState.items[0]);
        this.itemCloned.id = undefined;

        this.crudServiceRequests.create(this.itemCloned).subscribe((item) => {
          done();
        });
      });
    });
  }
}