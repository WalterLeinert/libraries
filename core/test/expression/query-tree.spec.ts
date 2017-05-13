// tslint:disable:max-classes-per-file
// tslint:disable:member-access

// tslint:disable-next-line:no-var-requires
require('reflect-metadata');

import { expect } from 'chai';
import { suite, test } from 'mocha-typescript';

import { StringBuilder } from '../../src/base/stringBuilder';
import { using } from '../../src/diagnostics';
import { AndTerm, BinaryTerm, NotTerm, OrTerm, Query, SelectorTerm, UnaryTerm } from '../../src/expression';
import { IVisitor, VisitableNode } from '../../src/pattern/visitor';
import { Indenter, Suspender } from '../../src/suspendable';


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


  public toString(): string {
    return this.sb.toString();
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
        this.indent('NOT');

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


@suite('core.expresssion')
class QueryTreeTest {

  @test 'should create simple query'() {
    const term = new SelectorTerm({ name: 'firstname', operator: '=', value: 'hugo' });

    const sb = new StringBuilder();

    const visitor = new TermVisitor(sb);
    term.accept(visitor);

    expect(JSON.stringify(term)).to.equal(
      `{"_selector":{"name":"firstname","operator":"=","value":"hugo"}}`);

    expect(visitor.toString()).to.equal(`
{ name: 'firstname', operator: '=', value: 'hugo' }`);
  }


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

    // console.log(sb.toString());

    const exprString = `{"_left":{"_selector":{"name":"firstname","operator":"=","value":"hugo"}},` +
      `"_right":{"_left":{"_selector":{"name":"age","operator":">","value":20}},` +
      `"_right":{"_left":{"_selector":{"name":"age","operator":"<=","value":6}},` +
      `"_right":{"_left":{"_selector":{"name":"gender","operator":"=","value":"male"}}}}}}`;

    expect(JSON.stringify(term)).to.equal(exprString);

    expect(visitor.toString()).to.equal(`
(
  { name: 'firstname', operator: '=', value: 'hugo' }
  AND
  (
    { name: 'age', operator: '>', value: '20' }
    OR
    (
      { name: 'age', operator: '<=', value: '6' }
      AND
      (
        NOT
        { name: 'gender', operator: '=', value: 'male' }
      )
    )
  )
)`);
  }


  @test 'should create query tree and visit (Query)'() {
    const query = new Query(
      new AndTerm(
        new SelectorTerm({ name: 'firstname', operator: '=', value: 'hugo' }),
        new OrTerm(
          new SelectorTerm({ name: 'age', operator: '>', value: 20 }),
          new AndTerm(
            new SelectorTerm({ name: 'age', operator: '<=', value: 6 }),
            new NotTerm(new SelectorTerm({ name: 'gender', operator: '=', value: 'male' }))
          )
        )
      )
    );

    const sb = new StringBuilder();

    const visitor = new TermVisitor(sb);
    query.accept(visitor);

    // console.log(sb.toString());

    const exprString = `{"_left":{"_selector":{"name":"firstname","operator":"=","value":"hugo"}},` +
      `"_right":{"_left":{"_selector":{"name":"age","operator":">","value":20}},` +
      `"_right":{"_left":{"_selector":{"name":"age","operator":"<=","value":6}},` +
      `"_right":{"_left":{"_selector":{"name":"gender","operator":"=","value":"male"}}}}}}`;

    expect(JSON.stringify(query.term)).to.equal(exprString);

    expect(visitor.toString()).to.equal(`
(
  { name: 'firstname', operator: '=', value: 'hugo' }
  AND
  (
    { name: 'age', operator: '>', value: '20' }
    OR
    (
      { name: 'age', operator: '<=', value: '6' }
      AND
      (
        NOT
        { name: 'gender', operator: '=', value: 'male' }
      )
    )
  )
)`);
  }

}