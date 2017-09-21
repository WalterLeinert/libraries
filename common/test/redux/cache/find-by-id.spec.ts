// tslint:disable:max-classes-per-file
// tslint:disable:member-access
// tslint:disable:no-unused-expression

import { expect } from 'chai';
import { suite, test } from 'mocha-typescript';


import { AppConfig, IAppConfig } from '../../../src/base/appConfig';
import { EntityStatus } from '../../../src/model/entity-status';
import { FilterBehaviour, StatusFilter } from '../../../src/model/service/status-filter';
import { IUser } from '../../../src/model/user.interface';
import { CrudServiceRequests, ServiceRequestStates } from '../../../src/redux';
import { FindingItemsCommand, ItemsFoundCommand } from '../../../src/redux';
import { EntityVersionCache } from '../../../src/redux/cache/entity-version-cache';
import { UserStore } from '../../../src/redux/store';

import { UserServiceFake } from '../../../src/testing/user-service-fake';
import { UserServiceRequestsFake } from '../../../src/testing/user-service-requests-fake';
import { ReduxBaseTest } from '../redux-base-test';


@suite('common.redux.cache.EntityVersionProxy: findById -- test if 2nd call returns data from cache')
class FindTest extends ReduxBaseTest<IUser, number, any> {

  constructor() {
    super(UserStore.ID, UserServiceRequestsFake, UserServiceFake, {
      url: '',
      mode: 'development',
      proxyMode: 'entityVersion'
    });
  }

  @test 'should dispatch findById -> not from cache'() {
    this.crudServiceRequests.findById(1).subscribe((items) => {
      expect(this.commands[1].fromCache).to.be.false;
    });
  }

  // call find -> all items in cache
  @test 'should dispatch find -> not from cache'() {
    this.crudServiceRequests.find().subscribe((items) => {
      expect(this.commands[1].fromCache).to.be.false;
    });
  }

  @test 'should dispatch findById -> from cache'() {
    this.crudServiceRequests.findById(1).subscribe((items) => {
      expect(this.commands[1].fromCache).to.be.true;
    });
  }


  protected static before(done: (err?: any) => void) {
    super.before(() => {
      EntityVersionCache.instance.reset();
      done();
    });
  }
}