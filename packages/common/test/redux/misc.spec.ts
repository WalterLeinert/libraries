// tslint:disable:max-classes-per-file
// tslint:disable:member-access

import { expect } from 'chai';
import { suite, test } from 'mocha-typescript';

import { IUser } from '../../src/model';
import { ItemFoundByIdCommand } from '../../src/redux';
import { UserStore } from '../../src/redux/store';

import { UserServiceFake } from '../../src/testing/user-service-fake';
import { UserServiceRequestsFake } from '../../src/testing/user-service-requests-fake';
import { ReduxBaseTest } from './redux-base-test';


@suite('common.redux: misc')
class MiscTest extends ReduxBaseTest<IUser, number, any> {

  constructor() {
    super(UserStore.ID, UserServiceRequestsFake, UserServiceFake);
  }

  @test 'should test getModelClassName, getEntityId'() {
    this.crudServiceRequests.findById(1).subscribe((item) => {

      expect(this.commands.length).to.equal(2);
      expect(this.commands[1]).to.be.instanceOf(ItemFoundByIdCommand);
      const state1 = this.getCrudStateAt(1);

      expect(this.crudServiceRequests.getModelClassName()).equals(this.serviceFake.getModelClassName());
      expect(this.crudServiceRequests.getEntityId(state1.item)).equals(state1.item.id);
    });
  }
}