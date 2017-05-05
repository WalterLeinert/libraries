// tslint:disable:max-classes-per-file
// tslint:disable:member-access

import { expect } from 'chai';
import { suite, test } from 'mocha-typescript';


import { IUser } from '../../src/model';
import { CrudServiceRequests, ServiceRequestStates } from '../../src/redux';
import { FindingItemByIdCommand, ItemFoundByIdCommand } from '../../src/redux';
import { UserStore } from '../../src/redux/store';

import { UserServiceFake } from '../../src/testing/user-service-fake';
import { UserServiceRequestsFake } from '../../src/testing/user-service-requests-fake';
import { ReduxBaseTest } from './redux-base-test.spec';


@suite('common.redux: findById')
class FindByIdTest extends ReduxBaseTest<IUser, number, any> {

  constructor() {
    super(UserStore.ID, UserServiceRequestsFake, UserServiceFake);
  }

  @test 'should dispatch commands: FindingItemByIdCommand, ItemFoundCommand'() {
    this.crudServiceRequests.findById(1).subscribe((item) => {
      expect(this.commands.length).to.equal(2);
      expect(this.commands[0]).to.be.instanceOf(FindingItemByIdCommand);

      const state0 = this.getCrudStateAt(0);
      expect(state0).to.deep.equal({
        ...CrudServiceRequests.INITIAL_STATE,
        state: ServiceRequestStates.RUNNING
      });

      expect(this.commands[1]).to.be.instanceOf(ItemFoundByIdCommand);

      const state1 = this.getCrudStateAt(1);
      expect(state1).to.deep.equal({
        ...CrudServiceRequests.INITIAL_STATE,
        item: state1.item,
        state: ServiceRequestStates.DONE
      });

    });
  }

}