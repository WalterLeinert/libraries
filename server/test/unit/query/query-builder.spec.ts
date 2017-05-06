// tslint:disable:max-classes-per-file
// tslint:disable:member-access

// tslint:disable-next-line:no-var-requires
require('reflect-metadata');

import * as chai from 'chai';
import { expect } from 'chai';
import * as chaiAsPromised from 'chai-as-promised';
import { only, suite, test } from 'mocha-typescript';



// Chai mit Promises verwenden (... to.become() ... etc.)
chai.use(chaiAsPromised);
chai.should();

import * as Knex from 'knex';

// -------------------------- logging -------------------------------
// tslint:disable-next-line:no-unused-variable
import { getLogger, ILogger, levels, using, XLog } from '@fluxgate/platform';
// -------------------------- logging -------------------------------

import { NumberIdGenerator, Role, SelectorTerm } from '@fluxgate/common';
import { AndTerm, NotTerm, OrTerm } from '@fluxgate/core';

import { KnexQueryVisitor } from '../../../src/ts-express-decorators-flx/services/knex-query-visitor';
import { RoleService } from '../../../src/ts-express-decorators-flx/services/role.service';
import { KnexTest } from '../knexTest.spec';



@suite('erste Role Tests') @only
class QueryBuilderTest extends KnexTest<Role, number> {
  protected static readonly logger = getLogger(QueryBuilderTest);

  private tableMetadata = KnexTest.metadataService.findTableMetadata(Role);

  public static before(done: () => void) {
    using(new XLog(QueryBuilderTest.logger, levels.INFO, 'static.before'), (log) => {
      super.before(() => {
        super.setup(Role, RoleService, new NumberIdGenerator(1), () => {
          done();
        });
      });
    });
  }


  @test 'should query admin role'() {
    const queryBuilder = KnexTest.knexService.knex.from('role');

    const term = new SelectorTerm({ name: 'name', operator: '=', value: 'admin' });

    const visitor = new KnexQueryVisitor(queryBuilder, this.tableMetadata);
    term.accept(visitor);

    visitor.query(queryBuilder).then((roles: Role[]) => {
      expect(roles).to.exist;
      expect(roles.length).to.equal(1);
      // expect(roles[0].name).to.equal(term.selector.value);
    });
  }

  @test 'should query admin or guest role'() {
    const queryBuilder = KnexTest.knexService.knex.from('role');

    const term = new OrTerm(
      new SelectorTerm({ name: 'name', operator: '=', value: 'admin' }),
      new SelectorTerm({ name: 'id', operator: '>', value: 2 })
    );

    const visitor = new KnexQueryVisitor(queryBuilder, this.tableMetadata);
    term.accept(visitor);

    visitor.query(queryBuilder).then((roles: Role[]) => {
      expect(roles).to.exist;
      expect(roles.length).to.equal(2);
      // expect(roles[0].name).to.equal(term.selector.value);
    });
  }

  @test 'should query admin name and admin id'() {
    const queryBuilder = KnexTest.knexService.knex.from('role');

    const term = new AndTerm(
      new SelectorTerm({ name: 'name', operator: '=', value: 'admin' }),
      new SelectorTerm({ name: 'id', operator: '=', value: 1 })
    );

    const visitor = new KnexQueryVisitor(queryBuilder, this.tableMetadata);
    term.accept(visitor);

    visitor.query(queryBuilder).then((roles: Role[]) => {
      expect(roles).to.exist;
      expect(roles.length).to.equal(1);
      // expect(roles[0].name).to.equal(term.selector.value);
    });
  }

}