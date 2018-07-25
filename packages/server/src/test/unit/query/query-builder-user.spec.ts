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

import { ConstantValueGenerator, NumberIdGenerator, User, UserRoleId } from '@fluxgate/common';
import { AndTerm, OrTerm, SelectorTerm } from '@fluxgate/core';

import { KnexQueryVisitor } from '../../../lib/ts-express-decorators-flx/services/knex-query-visitor';
import { UserService } from '../../../lib/ts-express-decorators-flx/services/user.service';
import { KnexTest } from '../knex-test';



@suite('server.query-builder-user')
class QueryBuilderTest extends KnexTest<User, number> {
  protected static readonly logger = getLogger(QueryBuilderTest);

  private tableMetadata = KnexTest.metadataService.findTableMetadata(User);

  public static before(done: () => void) {
    using(new XLog(QueryBuilderTest.logger, levels.INFO, 'static.before'), (log) => {
      super.before(() => {
        super.setup(UserService, {
          count: 1,
          maxCount: 1,
          idGenerator: new NumberIdGenerator(1),
          columns: {
            role: new ConstantValueGenerator(UserRoleId.User),
          },
          tableMetadata: KnexTest.metadataService.findTableMetadata(User)
        }, () => {
          done();
        });
      });
    });
  }


  @test 'should query user role or (not user role and user_id = 4'() {
    const queryBuilder = KnexTest.knexService.knex.from('user');

    const term = new OrTerm(
      new SelectorTerm({ name: 'role', operator: '=', value: 2 }),
      new AndTerm(
        new SelectorTerm({ name: 'role', operator: '!=', value: 2 }),
        new SelectorTerm({ name: 'id', operator: '=', value: 4 })
      )
    );

    const visitor = new KnexQueryVisitor(queryBuilder, this.tableMetadata);
    term.accept(visitor);

    return expect(visitor.query(queryBuilder).then((items) => items.length)).to.eventually.equal(2);
  }

}