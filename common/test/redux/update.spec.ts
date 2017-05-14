// tslint:disable:max-classes-per-file
// tslint:disable:member-access

import { expect } from 'chai';
import { suite, test } from 'mocha-typescript';

import { Clone } from '@fluxgate/core';
import { configure, IConfig } from '@fluxgate/core';

import { IUser } from '../../src/model';
import { ServiceRequestStates } from '../../src/redux';
import { IServiceState, ItemsFoundCommand, ItemUpdatedCommand, UpdatingItemCommand } from '../../src/redux';
import { UserStore } from '../../src/redux/store';

import { UserServiceFake } from '../../src/testing/user-service-fake';
import { UserServiceRequestsFake } from '../../src/testing/user-service-requests-fake';
import { ReduxBaseTest } from './redux-base-test.spec';


const config: IConfig = {
  appenders: [

  ],

  levels: {
    '[all]': 'WARN',
    'ServiceProxy': 'WARN',
    'EntityVersionProxy': 'WARN'
  }
};



@suite('common.redux: update')
class UpdateTest extends ReduxBaseTest<IUser, number, any> {
  private static readonly UPDATE_ID = 1;
  private beforeState: IServiceState;
  private item: IUser;
  private itemExpected: IUser;


  constructor() {
    super(UserStore.ID, UserServiceRequestsFake, UserServiceFake);
  }

  @test 'should dispatch command: UpdatingItemCommand'() {
    expect(this.commands.length).to.equal(3);
    expect(this.commands[0]).to.be.instanceOf(UpdatingItemCommand);

    const state0 = this.getCrudStateAt(0);
    expect(state0).to.deep.equal({
      ...this.beforeState,
      state: ServiceRequestStates.RUNNING
    });
  }


  @test 'should dispatch command: ItemUpdatedCommand'() {
    expect(this.commands.length).to.equal(3);
    expect(this.commands[1]).to.be.instanceOf(ItemUpdatedCommand);

    const state0 = this.getCrudStateAt(0);
    const state1 = this.getCrudStateAt(1);

    expect(state1).to.deep.equal({
      ...state0,
      item: this.itemExpected,
      state: ServiceRequestStates.DONE
    });
  }


  @test 'should dispatch command: ItemsFoundCommand'() {
    expect(this.commands.length).to.equal(3);

    expect(this.commands[2]).to.be.instanceOf(ItemsFoundCommand);

    const state1 = this.getCrudStateAt(1);
    const state2 = this.getCrudStateAt(2);

    expect(state2).to.deep.equal({
      ...state1,
      items: state1.items.map((elem) => elem.id !== this.itemExpected.id ? elem : this.itemExpected)
    });
  }


  protected static before() {
    configure(config);
  }

  protected before(done: (err?: any) => void) {
    super.before(() => {
      this.serviceFake.findById(UpdateTest.UPDATE_ID).subscribe((item) => {
        this.item = item;

        // snapshot vom Status
        this.beforeState = this.getStoreState();

        this.reset();

        this.itemExpected = Clone.clone(this.item);
        const itemToUpdate = Clone.clone(this.item);
        itemToUpdate.username = item.username + '-updated';

        this.itemExpected.username = itemToUpdate.username;
        this.itemExpected.__version++;

        // Test: update item
        this.crudServiceRequests.update(itemToUpdate).subscribe(() => {
          done();
        });

      }, (error) => {
        done(error);
      });
    });
  }
}