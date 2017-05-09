// tslint:disable:max-classes-per-file
// tslint:disable:member-access

import { expect } from 'chai';
import { suite, test } from 'mocha-typescript';

import { AndTerm, NotTerm, OrTerm, SelectorTerm } from '../../src/expression';
import { SerializerBaseTest } from './serializer-base-test';


@suite('core.serialization')
class ExpressionTest extends SerializerBaseTest {

  @test 'should serialize/deserialize simple query'() {
    const term = new SelectorTerm({ name: 'firstname', operator: '=', value: 'hugo' });

    const termSerialized = this.formatter.serialize(term);
    const termDeserialized = this.formatter.deserialize(termSerialized);
    expect(term).to.eql(termDeserialized);
  }

  @test 'should serialize/deserialize simple tree'() {
    const term =
      new AndTerm(
        new SelectorTerm({ name: 'age', operator: '<=', value: 6 }),
        new NotTerm(new SelectorTerm({ name: 'gender', operator: '=', value: 'male' }))
      );

    const termSerialized = this.formatter.serialize(term);
    const termDeserialized = this.formatter.deserialize(termSerialized);
    expect(term).to.eql(termDeserialized);
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
    expect(term).to.eql(termDeserialized);
  }

}