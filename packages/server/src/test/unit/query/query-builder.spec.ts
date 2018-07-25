// tslint:disable:max-classes-per-file
// tslint:disable:member-access

// tslint:disable-next-line:no-var-requires
require('reflect-metadata');

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

import { NumberIdGenerator, Role, } from '@fluxgate/common';
import { AndTerm, OrTerm, SelectorTerm } from '@fluxgate/core';

import { KnexQueryVisitor } from '../../../lib/ts-express-decorators-flx/services/knex-query-visitor';
import { RoleService } from '../../../lib/ts-express-decorators-flx/services/role.service';
import { KnexTest } from '../knex-test';



@suite('server.query-builder')
class QueryBuilderTest extends KnexTest<Role, number> {
  protected static readonly logger = getLogger(QueryBuilderTest);

  private tableMetadata = KnexTest.metadataService.findTableMetadata(Role);

  public static before(done: () => void) {
    using(new XLog(QueryBuilderTest.logger, levels.INFO, 'static.before'), (log) => {
      super.before(() => {
        super.setup(RoleService, new NumberIdGenerator(1), () => {
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

    return expect(visitor.query(queryBuilder).then((roles: Role[]) => roles.length)).to.eventually.equal(1);
  }

  @test 'should query admin or guest role'() {
    const queryBuilder = KnexTest.knexService.knex.from('role');

    const term = new OrTerm(
      new SelectorTerm({ name: 'name', operator: '=', value: 'admin' }),
      new SelectorTerm({ name: 'id', operator: '>', value: 2 })
    );

    const visitor = new KnexQueryVisitor(queryBuilder, this.tableMetadata);
    term.accept(visitor);
    return expect(visitor.query(queryBuilder).then((roles: Role[]) => roles.length)).to.eventually.equal(2);
  }

  @test 'should query admin name and admin id'() {
    const queryBuilder = KnexTest.knexService.knex.from('role');

    const term = new AndTerm(
      new SelectorTerm({ name: 'name', operator: '=', value: 'admin' }),
      new SelectorTerm({ name: 'id', operator: '=', value: 1 })
    );

    const visitor = new KnexQueryVisitor(queryBuilder, this.tableMetadata);
    term.accept(visitor);

    return expect(visitor.query(queryBuilder).then((roles: Role[]) => roles.length)).to.eventually.equal(1);
  }

}