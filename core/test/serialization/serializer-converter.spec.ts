// tslint:disable:member-access
// tslint:disable:max-classes-per-file

import { expect } from 'chai';
import { suite, test } from 'mocha-typescript';

import { Funktion } from '../../src/base/objectType';
import { JsonFormatter, Serializable } from '../../src/serialization';
import { ShortTime, Hour, Types } from '../../src/types';


@Serializable()
class TestConverter {

  @Serializable()
  private _id: number;

  @Serializable()
  public name: string;

  constructor(id?: number) {
    this._id = id;
    this.name = `Test2-${id}`;

    if (Types.isPresent(id)) {
      this.now = new ShortTime(id as Hour, 0);
    }
  }

  public now: ShortTime;
}



@suite('core.serialization (with converter)')
class SerializerConverterTest {
  private formatter: JsonFormatter;

  @test 'should serialize null/undefined'() {
    const test = new TestConverter(11);

    const testSerialized = this.formatter.serialize(test);
    const testDeserialized = this.formatter.deserialize(testSerialized);
    expect(test).to.eql(testDeserialized);
  }


  before() {
    this.formatter = new JsonFormatter();
  }
}