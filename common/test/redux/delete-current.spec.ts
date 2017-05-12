// tslint:disable:max-classes-per-file
// tslint:disable:member-access

import { expect } from 'chai';
import { suite, test } from 'mocha-typescript';


import { IUser } from '../../src/model';
import {
  CommandStore, DeletingItemCommand, ExtendedCrudServiceRequests, IExtendedCrudServiceState, IServiceState,
  ItemDeletedCommand, ItemsFoundCommand, ReduxParentStore,
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
  public static ID = 'userSelector';

  constructor(parent?: CommandStore<IExtendedCrudServiceState<IUser, number>>) {
    super(UserSelectorStore.ID, ExtendedCrudServiceRequests.INITIAL_STATE, parent);
  }
}


@suite('common.redux: delete (current)')
class DeleteCurrentTest extends ReduxBaseTest<IUser, number, any> {
  private static readonly DELETE_ID = 1;
  private beforeState: IServiceState;
  private itemToDelete: IUser;

  constructor() {
    super(UserStore.ID, ExtendedUserServiceRequestsFake, UserServiceFake);
  }


  @test 'should dispatch command: ItemDeletedCommand'() {
    expect(this.commands.length).to.equal(3);
    expect(this.commands[1]).to.be.instanceOf(ItemDeletedCommand);


    const state0 = this.getCrudStateAt(0);

    // state nach ItemDeleted
    const state1 = this.getCrudStateAt(1);

    expect(state1).to.deep.equal({
      ...state0,
      currentItem: null,            // current wurde gelöscht
      deletedId: DeleteCurrentTest.DELETE_ID,
      state: ServiceRequestStates.DONE
    });
  }


  protected before(done: (err?: any) => void) {
    super.before(() => {
      //
      // before-Status erzeugen
      //
      this.crudServiceRequests.find().subscribe((items) => {
        const state = this.getCrudState();

        this.itemToDelete = state.items.filter((item) => item.id === DeleteCurrentTest.DELETE_ID)[0];

        // currentItem setzen -> nach update prüfen
        this.currentItemServiceRequests.setCurrent(this.itemToDelete).subscribe((item) => {
          // snapshot vom Status
          this.beforeState = this.getStoreState();

          this.reset();

          // Test: Item löschen
          this.crudServiceRequests.delete(DeleteCurrentTest.DELETE_ID).subscribe((id) => {
            done();
          });
        });
      });
    });
  }
}