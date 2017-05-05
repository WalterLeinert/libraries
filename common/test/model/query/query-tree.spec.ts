// tslint:disable:max-classes-per-file
// tslint:disable:member-access

// tslint:disable-next-line:no-var-requires
require('reflect-metadata');

import { expect } from 'chai';
import { only, suite, test } from 'mocha-typescript';

import {
  AndTerm, BinaryTerm, Indenter, IVisitor, NotTerm, OrTerm, StringBuilder,
  Suspender, UnaryTerm, using, VisitableNode
} from '@fluxgate/core';

import { SelectorTerm } from '../../../src/model/query/selector-term';



class TermVisitor implements IVisitor<VisitableNode> {
  private indenter: Indenter = new Indenter();
  constructor(private sb: StringBuilder) {
  }


  public visit(term: BinaryTerm | UnaryTerm) {
    if (term instanceof BinaryTerm) {
      this.visitBinaryTerm(term);
    } else {
      this.visitUnaryTerm(term);
    }
  }


  private visitBinaryTerm(term: BinaryTerm) {
    if (term instanceof AndTerm) {
      this.handleBinaryTerm('AND', term);
    } else if (term instanceof OrTerm) {
      this.handleBinaryTerm('OR', term);
    }
  }

  private handleBinaryTerm(op: string, term) {
    this.indent('(');

    using(new Suspender([this.indenter]), () => {
      term.leftTerm.accept(this);

      this.indent(op);

      term.rightTerm.accept(this);
    });

    this.indentLine(')');
  }

  private visitUnaryTerm(term: UnaryTerm) {
    if (term instanceof NotTerm) {
      this.indent('(');

      using(new Suspender([this.indenter]), () => {
        this.indent('NOT ');

        term.term.accept(this);
      });

      this.indentLine(')');

    } else if (term instanceof SelectorTerm) {
      this.indent();

      this.sb.append('{ ');

      this.sb.append(`name: '${term.selector.name}'`);
      this.sb.append(', ');

      this.sb.append(`operator: '${term.selector.operator}'`);
      this.sb.append(', ');

      this.sb.append(`value: '${term.selector.value}'`);

      this.sb.append(' }');
    }
  }

  private indent(text: string = '') {
    this.sb.appendLine();
    this.sb.append(this.indenter.getIndentation());
    this.sb.append(text);
  }

  private indentLine(text: string) {
    this.indent(text);
  }
}


@suite('model.query') @only
class QueryTreeTest {

  @test 'should create query tree and visit'() {
    const term = new AndTerm(
      new SelectorTerm({ name: 'firstname', operator: '=', value: 'hugo' }),
      new OrTerm(
        new SelectorTerm({ name: 'age', operator: '>', value: 20 }),
        new AndTerm(
          new SelectorTerm({ name: 'age', operator: '<=', value: 6 }),
          new NotTerm(new SelectorTerm({ name: 'gender', operator: '=', value: 'male' }))
        )
      )
    );

    const sb = new StringBuilder();

    const visitor = new TermVisitor(sb);
    term.accept(visitor);

    console.log(sb.toString());


    expect(term).to.be.not.null;
  }
}