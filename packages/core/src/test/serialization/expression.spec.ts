// tslint:disable:max-classes-per-file
// tslint:disable:member-access

import { expect } from 'chai';
import { suite, test } from 'mocha-typescript';

import { configure, IConfig } from '../../lib/diagnostics';

import { AndTerm, NotTerm, OrTerm, Query, SelectorTerm } from '../../lib/expression';
import { SerializerBaseTest } from './serializer-base-test';


@suite('core.serialization (expressions)')
class ExpressionTest extends SerializerBaseTest {

  config: IConfig = {
    appenders: [
    ],

    levels: {
      '[all]': 'WARN',
      'Test': 'DEBUG',
      'Test2': 'INFO'
    }
  };


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

  @test 'should serialize/deserialize query tree (Query)'() {

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

    const querySerialized = this.formatter.serialize(query);
    const queryDeserialized = this.formatter.deserialize(querySerialized);
    expect(query).to.eql(queryDeserialized);
  }


  public before() {
    super.before();

    configure(this.config);
  }

}