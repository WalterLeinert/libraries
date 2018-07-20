// tslint:disable:max-classes-per-file
// tslint:disable:member-access

import { expect } from 'chai';
import { suite, test } from 'mocha-typescript';


import { IUser } from '../../lib/model';
import {
  CommandStore, CurrentItemSetCommand, ExtendedCrudServiceRequests, IExtendedCrudServiceState,
  IServiceState, ItemDeletedCommand,
  ItemsFoundCommand, ReduxParentStore,
  ServiceRequestStates, UserStore
} from '../../lib/redux';
import { ExtendedUserServiceRequestsFake } from '../../lib/testing';
import { UserServiceFake } from '../../lib/testing/user-service-fake';
import { ReduxBaseTest } from './redux-base-test';


interface IDeleteRange {
  from: number;
  to: number;
}

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
  private beforeState: IServiceState;
  private itemToDelete: IUser;

  constructor() {
    super(UserStore.ID, ExtendedUserServiceRequestsFake, UserServiceFake);
  }


  @test 'should dispatch command: ItemDeletedCommand, CurrentItemSetCommand (first)'() {
    const idToDelete = 1;   // erstes Item
    this.setupTest(undefined, idToDelete, () => {
      expect(this.commands.length).to.equal(4);
      expect(this.commands[1]).to.be.instanceOf(ItemDeletedCommand);
      expect(this.commands[2]).to.be.instanceOf(ItemsFoundCommand);
      expect(this.commands[3]).to.be.instanceOf(CurrentItemSetCommand);


      const state0 = this.getCrudStateAt(0);

      // state nach ItemDeleted
      const state1 = this.getCrudStateAt(1);

      expect(state1).to.deep.equal({
        ...state0,
        currentItem: null,            // current wurde gelöscht
        deletedId: idToDelete,
        state: ServiceRequestStates.DONE
      });


      // currentItem state nach ItemDeleted
      const state3 = this.getCurrentItemStateAt(3);

      // currentItem muss 2. Item sein
      expect(state3.currentItem.id).to.equal(idToDelete + 1);
    });
  }



  @test 'should dispatch command: ItemDeletedCommand, CurrentItemSetCommand (last)'() {
    const idToDelete = UserServiceFake.ITEMS;   // letztes Item
    this.setupTest(undefined, idToDelete, () => {
      expect(this.commands.length).to.equal(4);
      expect(this.commands[1]).to.be.instanceOf(ItemDeletedCommand);
      expect(this.commands[2]).to.be.instanceOf(ItemsFoundCommand);
      expect(this.commands[3]).to.be.instanceOf(CurrentItemSetCommand);


      const state0 = this.getCrudStateAt(0);

      // state nach ItemDeleted
      const state1 = this.getCrudStateAt(1);

      expect(state1).to.deep.equal({
        ...state0,
        currentItem: null,            // current wurde gelöscht
        deletedId: idToDelete,
        state: ServiceRequestStates.DONE
      });


      // currentItem state nach ItemDeleted
      const state3 = this.getCurrentItemStateAt(3);

      // currentItem muss vorletztes Item sein
      expect(state3.currentItem.id).to.equal(UserServiceFake.ITEMS - 1);
    });
  }


  @test 'should dispatch command: ItemDeletedCommand, CurrentItemSetCommand (middle)'() {
    const idToDelete = UserServiceFake.ITEMS / 2;   // mittleres Item
    this.setupTest(undefined, idToDelete, () => {
      expect(this.commands.length).to.equal(4);
      expect(this.commands[1]).to.be.instanceOf(ItemDeletedCommand);
      expect(this.commands[2]).to.be.instanceOf(ItemsFoundCommand);
      expect(this.commands[3]).to.be.instanceOf(CurrentItemSetCommand);


      const state0 = this.getCrudStateAt(0);

      // state nach ItemDeleted
      const state1 = this.getCrudStateAt(1);

      expect(state1).to.deep.equal({
        ...state0,
        currentItem: null,            // current wurde gelöscht
        deletedId: idToDelete,
        state: ServiceRequestStates.DONE
      });


      // currentItem state nach ItemDeleted
      const state3 = this.getCurrentItemStateAt(3);

      // currentItem muss vorletztes Item sein
      expect(state3.currentItem.id).to.equal(idToDelete + 1);
    });
  }


  @test 'should dispatch command: ItemDeletedCommand, CurrentItemSetCommand (last one)'() {
    const idToDelete = 1;   // erste Item
    this.setupTest({ from: 2, to: UserServiceFake.ITEMS }, idToDelete, () => {
      expect(this.commands.length).to.equal(4);
      expect(this.commands[1]).to.be.instanceOf(ItemDeletedCommand);
      expect(this.commands[2]).to.be.instanceOf(ItemsFoundCommand);
      expect(this.commands[3]).to.be.instanceOf(CurrentItemSetCommand);


      const state0 = this.getCrudStateAt(0);

      // state nach ItemDeleted
      const state1 = this.getCrudStateAt(1);

      expect(state1).to.deep.equal({
        ...state0,
        currentItem: null,            // current wurde gelöscht
        deletedId: idToDelete,
        state: ServiceRequestStates.DONE
      });


      // currentItem state nach ItemDeleted
      const state3 = this.getCurrentItemStateAt(3);

      // currentItem undefined
      // tslint:disable-next-line:no-unused-expression
      expect(state3.currentItem).to.be.undefined;
    });
  }




  /**
   * Testvorbereitung: das Item mit der Id wird als current markiert und gelöscht
   *
   * @param id
   * @param done
   */
  private setupTest(deleteRange: IDeleteRange, id: number, done: (err?: any) => void) {
    //
    // before-Status erzeugen
    //
    this.crudServiceRequests.find().subscribe((items) => {
      const state = this.getCrudState();

      this.itemToDelete = state.items.filter((item) => item.id === id)[0];


      const deletePromises: Array<Promise<any>> = [];

      if (deleteRange) {
        for (let idToDelete = deleteRange.from; idToDelete <= deleteRange.to; idToDelete++) {
          const promise = new Promise<any>((resolve, reject) => {
            this.crudServiceRequests.deleteById(idToDelete).subscribe((deletedId) => {
              resolve();
            });
          });
          deletePromises.push(promise);
        }
      }

      //
      // erst nach dem Löschen des Ranges den eigentlichen Test vorbereiten
      //
      Promise.all(deletePromises).then(() => {

        // currentItem setzen -> nach update prüfen
        this.currentItemServiceRequests.setCurrent(this.itemToDelete).subscribe((item) => {
          // snapshot vom Status
          this.beforeState = this.getStoreState();

          this.reset();

          // Test: Item löschen
          this.crudServiceRequests.deleteById(id).subscribe((deletedId) => {
            done();
          });
        });
      });

    });
  }
}