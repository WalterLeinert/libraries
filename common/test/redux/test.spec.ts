// tslint:disable:max-classes-per-file
// tslint:disable:member-access

// tslint:disable-next-line:no-var-requires
require('reflect-metadata');


import { expect } from 'chai';
import { only, suite, test } from 'mocha-typescript';


// -------------------------- logging -------------------------------
// tslint:disable-next-line:no-unused-variable
import { getLogger, ILogger, levels, using, XLog } from '@fluxgate/platform';
// -------------------------- logging -------------------------------


import { IUser } from '../../src/model';
import { ServiceCommand, ServiceRequestStates } from '../../src/redux';
import { FindingItemsCommand, ItemsFoundCommand } from '../../src/redux';
import { FindingItemByIdCommand, ItemFoundByIdCommand } from '../../src/redux';

import { ReduxBaseTest } from './redux-base-test.spec';
import { UserServiceFake } from './user-service-fake';
import { UserServiceRequests } from './user-service-requests';
import { UserStore } from './user-store';


@suite('redux') @only
class ReduxTest extends ReduxBaseTest<IUser, number, any> {
  protected static readonly logger = getLogger(ReduxTest);

  constructor() {
    super(UserStore.ID, UserServiceRequests, UserServiceFake);
  }


  @test 'should call find (FindingItemsCommand, ItemsFoundCommand)'() {
    this.serviceRequests.find();

    expect(this.commands.length).to.equal(2);
    expect(this.commands[0]).to.be.instanceOf(FindingItemsCommand);

    const state0 = this.states[0];
    expect(state0).to.deep.equal({
      ...ServiceCommand.INITIAL_STATE,
      state: ServiceRequestStates.RUNNING
    });

    expect(this.commands[1]).to.be.instanceOf(ItemsFoundCommand);

    const state1 = this.states[1];
    expect(state1).to.deep.equal({
      ...ServiceCommand.INITIAL_STATE,
      items: state1.items,
      state: ServiceRequestStates.DONE
    });

  }

  @test 'should call findById (FindingItemByIdCommand, ItemFoundCommand)'() {
    this.serviceRequests.findById(1);

    expect(this.commands.length).to.equal(2);
    expect(this.commands[0]).to.be.instanceOf(FindingItemByIdCommand);

    const state0 = this.states[0];
    expect(state0).to.deep.equal({
      ...ServiceCommand.INITIAL_STATE,
      state: ServiceRequestStates.RUNNING
    });

    expect(this.commands[1]).to.be.instanceOf(ItemFoundByIdCommand);

    const state1 = this.states[1];
    expect(state1).to.deep.equal({
      ...ServiceCommand.INITIAL_STATE,
      item: state1.item,
      state: ServiceRequestStates.DONE
    });

  }

}