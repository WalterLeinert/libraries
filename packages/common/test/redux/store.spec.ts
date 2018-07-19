// tslint:disable:max-classes-per-file
// tslint:disable:member-access

import { expect } from 'chai';
import { suite, test } from 'mocha-typescript';

import { Funktion, InvalidOperationException } from '@fluxgate/core';

import { IUser } from '../../src/model';
import {
  CommandStore, CommandStoreStorage, ExtendedCrudServiceRequests, IExtendedCrudServiceState, ReduxStore, Store
} from '../../src/redux';


const duplicateStoreTester = (): Funktion[] => {
  @ReduxStore()
  class UserStore1 extends CommandStore<IExtendedCrudServiceState<IUser, number>> {
    public static ID = 'store1';

    constructor(parent?: CommandStore<IExtendedCrudServiceState<IUser, number>>) {
      super(UserStore1.ID, ExtendedCrudServiceRequests.INITIAL_STATE, parent);
    }
  }

  @ReduxStore()
  class UserStore2 extends CommandStore<IExtendedCrudServiceState<IUser, number>> {
    public static ID = 'store1';

    constructor(parent?: CommandStore<IExtendedCrudServiceState<IUser, number>>) {
      super(UserStore2.ID, ExtendedCrudServiceRequests.INITIAL_STATE, parent);
    }
  }

  return [
    UserStore1, UserStore2
  ];
};




@suite('common.redux: store')
class ParentStoreTest {
  private stores: Funktion[];

  @test 'should throw exception (duplicate store)'() {
    this.stores = duplicateStoreTester();
    expect(() => new Store()).to.throw(InvalidOperationException);
  }


  protected after(done: (err?: any) => void) {
    // Stores für folgende Tests wieder entfernen
    this.stores.forEach((store) => {
      CommandStoreStorage.instance.removeStoreMetadata(store);
    });

    done();
  }
}