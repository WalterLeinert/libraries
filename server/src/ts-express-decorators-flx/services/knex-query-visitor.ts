import * as Knex from 'knex';

// -------------------------- logging -------------------------------
// tslint:disable-next-line:no-unused-variable
import { getLogger, ILogger, levels, using, XLog } from '@fluxgate/platform';
// -------------------------- logging -------------------------------

import { SelectorTerm, TableMetadata } from '@fluxgate/common';
import {
  AndTerm, Assert, BinaryTerm, IVisitor, NotSupportedException, NotTerm, OrTerm, Stack, UnaryTerm, VisitableNode
} from '@fluxgate/core';


export type PartialQuery = (qb: Knex.QueryBuilder) => Knex.QueryBuilder;

type Operator = 'AND' | 'OR';


/**
 * Visitor zum Aufbau einer Knex-Query aus einem Query-Tree.
 *
 * @class KnexVisitor
 * @implements {IVisitor<VisitableNode>}
 */
export class KnexQueryVisitor implements IVisitor<VisitableNode> {
  private queryStack: Stack<PartialQuery> = new Stack<PartialQuery>();

  constructor(private queryBuilder: Knex.QueryBuilder, private tableMetadata: TableMetadata) {
    Assert.notNull(queryBuilder);
    Assert.notNull(tableMetadata);
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

  private handleBinaryTerm(op: Operator, term) {

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
      const columnName = this.tableMetadata.getDbColumnName(term.selector.name);
      this.queryStack.push((qb) => qb.where(columnName, term.selector.operator, term.selector.value));
    }
  }
}