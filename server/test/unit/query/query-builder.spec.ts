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
import {
  AndTerm, BinaryTerm, IVisitor, NotSupportedException, NotTerm, OrTerm, Stack, UnaryTerm, VisitableNode
} from '@fluxgate/core';

import { RoleService } from '../../../src/ts-express-decorators-flx/services/role.service';
import { KnexTest } from '../knexTest.spec';

type PartialQuery = (qb: Knex.QueryBuilder) => Knex.QueryBuilder;

class KnexVisitor implements IVisitor<VisitableNode> {
  private queryStack: Stack<PartialQuery> = new Stack<PartialQuery>();

  constructor(private queryBuilder: Knex.QueryBuilder) {
  }

  public visit(term: BinaryTerm | UnaryTerm) {
    if (term instanceof BinaryTerm) {
      this.visitBinaryTerm(term);
    } else {
      this.visitUnaryTerm(term);
    }
  }

  public get query(): PartialQuery {
    return this.queryStack.pop();
  }

  private visitBinaryTerm(term: BinaryTerm) {
    if (term instanceof AndTerm) {
      this.handleBinaryTerm('AND', term);
    } else if (term instanceof OrTerm) {
      this.handleBinaryTerm('OR', term);
    }
  }

  private handleBinaryTerm(op: string, term) {

    term.leftTerm.accept(this);
    this.queryBuilder.where(this.queryStack.pop());

    term.rightTerm.accept(this);

    switch (op) {
      case 'AND':
        this.queryStack.push((qb) => qb.andWhere(this.queryStack.pop()));
        break;

      case 'OR':
        this.queryStack.push((qb) => qb.orWhere(this.queryStack.pop()));
        break;

      default:
        throw new NotSupportedException(`operator = ${op}`);
    }
  }


  private visitUnaryTerm(term: UnaryTerm) {
    if (term instanceof NotTerm) {
      term.term.accept(this);

      this.queryStack.push((qb) => qb.andWhereNot(this.queryStack.pop()));

    } else if (term instanceof SelectorTerm) {
      this.queryStack.push((qb) => qb.where(term.selector.name, term.selector.operator, term.selector.value));
    }
  }
}



@suite('erste Role Tests') @only
class QueryBuilderTest extends KnexTest<Role, number> {
  protected static readonly logger = getLogger(QueryBuilderTest);

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

    const term = new SelectorTerm({ name: 'role_name', operator: '=', value: 'admin' });

    const visitor = new KnexVisitor(queryBuilder);
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
      new SelectorTerm({ name: 'role_name', operator: '=', value: 'admin' }),
      new SelectorTerm({ name: 'role_id', operator: '>', value: 2 })
    );

    const visitor = new KnexVisitor(queryBuilder);
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
      new SelectorTerm({ name: 'role_name', operator: '=', value: 'admin' }),
      new SelectorTerm({ name: 'role_id', operator: '=', value: 1 })
    );

    const visitor = new KnexVisitor(queryBuilder);
    term.accept(visitor);

    visitor.query(queryBuilder).then((roles: Role[]) => {
      expect(roles).to.exist;
      expect(roles.length).to.equal(1);
      // expect(roles[0].name).to.equal(term.selector.value);
    });
  }

}