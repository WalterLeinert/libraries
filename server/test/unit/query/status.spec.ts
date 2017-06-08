// tslint:disable:member-access

// tslint:disable-next-line:no-var-requires
require('reflect-metadata');

// tslint:disable-next-line:no-var-requires
// let jsondiff = require('json-diff-patch');

import * as chai from 'chai';
import { expect } from 'chai';
import * as chaiAsPromised from 'chai-as-promised';
import { suite, test } from 'mocha-typescript';


// Chai mit Promises verwenden (... to.become() ... etc.)
chai.use(chaiAsPromised);
chai.should();

// -------------------------- logging -------------------------------
// tslint:disable-next-line:no-unused-variable
import { getLogger, ILogger, levels, using, XLog } from '@fluxgate/platform';
// -------------------------- logging -------------------------------

import {
  CreateResult, DeleteResult, EntityStatus, FilterBehaviour, FindByIdResult, IRole,
  NumberIdGenerator, Role, ServiceResult, StatusFilter, UpdateResult
} from '@fluxgate/common';
import { Clone, ICtor } from '@fluxgate/core';


import { KnexTest } from '../knexTest.spec';
import { QueryTest } from './query-test';
import { QueryTestService } from './query-test.service';


@suite('Tests für Entity-Status (deleted, archived, ...)')
class StatusTest extends KnexTest<Role, number> {
  protected static readonly logger = getLogger(StatusTest);

  public static before(done: () => void) {
    using(new XLog(StatusTest.logger, levels.INFO, 'static.before'), (log) => {
      super.before(() => {

        super.setup(QueryTestService, new NumberIdGenerator(1), () => {
          done();
        });
      });
    });
  }


  @test 'should find entities with status = 0'() {
    return expect(this.service.find(undefined)
      .then((result) => result.items.length))
      .to.become(1);
  }

  @test 'should find entities with status = 0 (with filter)'() {
    return expect(this.service.find(undefined, new StatusFilter(FilterBehaviour.None, EntityStatus.None))
      .then((result) => result.items.length))
      .to.become(1);
  }

  @test 'should find only deleted entities'() {
    return expect(this.service.find(undefined, new StatusFilter(FilterBehaviour.Only, EntityStatus.Deleted))
      .then((result) => result.items.length))
      .to.become(2);
  }

  @test 'should find only archived entities'() {
    return expect(this.service.find(undefined, new StatusFilter(FilterBehaviour.Only, EntityStatus.Archived))
      .then((result) => result.items.length))
      .to.become(3);
  }

  @test 'should find entities including deleted'() {
    return expect(this.service.find(undefined, new StatusFilter(FilterBehaviour.Add, EntityStatus.Deleted))
      .then((result) => result.items.length))
      .to.become(3);
  }

  @test 'should find entities including archived'() {
    return expect(this.service.find(undefined, new StatusFilter(FilterBehaviour.Add, EntityStatus.Archived))
      .then((result) => result.items.length))
      .to.become(4);
  }

  @test 'should find entities excluding deleted'() {
    return expect(this.service.find(undefined, new StatusFilter(FilterBehaviour.Exclude, EntityStatus.Deleted))
      .then((result) => result.items.length))
      .to.become(3);
  }

  @test 'should find entities excluding archived'() {
    return expect(this.service.find(undefined, new StatusFilter(FilterBehaviour.Exclude, EntityStatus.Archived))
      .then((result) => result.items.length))
      .to.become(2);
  }
}