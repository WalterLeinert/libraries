// tslint:disable:max-classes-per-file
// tslint:disable:member-access

import { expect } from 'chai';
import { only, suite, test } from 'mocha-typescript';


import { IUser } from '../../src/model';
import {
  CommandStore, DeletingItemCommand, ExtendedCrudServiceRequests, IExtendedCrudServiceState, IServiceState,
  ItemDeletedCommand, ReduxParentStore,
  ServiceRequestStates, UserStore
} from '../../src/redux';
import { ExtendedUserServiceRequestsFake } from '../../src/testing';
import { UserServiceFake } from '../../src/testing/user-service-fake';
import { ReduxBaseTest } from './redux-base-test.spec';

/**
 * SelectorStore, der auf dem UserStore als Parent basiert
 *
 * @export
 * @class UserSelectorStore
 * @extends {CommandStore<IServiceState<IUser, number>>}
 */
@ReduxParentStore(() => UserStore)
export class UserSelectorStore extends CommandStore<IExtendedCrudServiceState<IUser, number>> {
  public static ID = 'userSelectorStore';

  constructor(parent?: CommandStore<IExtendedCrudServiceState<IUser, number>>) {
    super(UserSelectorStore.ID, ExtendedCrudServiceRequests.INITIAL_STATE, parent);
  }
}


@suite('redux: delete (current)')
class DeleteCurrentTest extends ReduxBaseTest<IUser, number, any> {
  private static readonly DELETE_ID = 1;
  private beforeState: IServiceState;
  private itemToDelete: IUser;

  constructor() {
    super(UserStore.ID, ExtendedUserServiceRequestsFake, UserServiceFake);
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

    const beforeItems = (this.beforeState as IExtendedCrudServiceState<IUser, number>).items;

    expect(state1).to.deep.equal({
      ...this.beforeState,
      items: beforeItems.filter((item) => item.id !== DeleteCurrentTest.DELETE_ID),
      currentItem: null,
      deletedId: DeleteCurrentTest.DELETE_ID,
      state: ServiceRequestStates.DONE
    });
  }


  @test 'should exist one item less'(done: (err?: any) => void) {
    this.serviceFake.find().subscribe((items) => {
      const beforeItems = (this.beforeState as IExtendedCrudServiceState<IUser, number>).items;

      if (items.length !== beforeItems.length - 1) {
        done(new Error(`items.length (${items.length}) !== this.beforeState.items.length - 1` +
          ` (${beforeItems.length - 1})`));
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
      this.crudServiceRequests.find();

      const state = this.getCrudState();

      this.itemToDelete = state.items.filter((item) => item.id === DeleteCurrentTest.DELETE_ID)[0];

      // currentItem setzen -> nach update prüfen
      this.currentItemServiceRequests.setCurrent(this.itemToDelete);

      // snapshot vom Status
      this.beforeState = this.getStoreState();

      this.reset();

      // Test: Item löschen
      this.crudServiceRequests.delete(DeleteCurrentTest.DELETE_ID);

      done();
    });
  }

}