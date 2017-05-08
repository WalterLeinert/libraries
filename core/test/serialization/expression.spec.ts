// tslint:disable:max-classes-per-file
// tslint:disable:member-access

// tslint:disable-next-line:no-var-requires
require('reflect-metadata');

import { expect } from 'chai';
import { only, suite, test } from 'mocha-typescript';

import {
  AndTerm, BinaryTerm, SelectorTerm, NotTerm, OrTerm, UnaryTerm
} from '../../src/expression';
import { JsonFormatter } from '../../src/serialization';


@suite('model.query') @only
class ExpressionTest {
  private formatter: JsonFormatter;

  @test 'should serialize/deserialize simple query'() {
    const term = new SelectorTerm({ name: 'firstname', operator: '=', value: 'hugo' });

    const termSerialized = this.formatter.serialize(term);
    const termDeserialized = this.formatter.deserialize(termSerialized);
    expect(termSerialized).to.eql(termDeserialized);
  }


  @test 'should serialize/deserialize query tree'() {
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

    const termSerialized = this.formatter.serialize(term);
    const termDeserialized = this.formatter.deserialize(termSerialized);
    expect(termSerialized).to.eql(termDeserialized);
  }


  before() {
    this.formatter = new JsonFormatter();
  }
}