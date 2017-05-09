// tslint:disable:member-access
// tslint:disable:max-classes-per-file

import { expect } from 'chai';
import { suite, test } from 'mocha-typescript';

import { Serializable } from '../../src/serialization';
import { Hour, ShortTime, Types } from '../../src/types';
import { SerializerBaseTest } from './serializer-base-test';


@Serializable()
class TestConverter {

  @Serializable()
  private _id: number;

  @Serializable()
  public name: string;

  public now: ShortTime;

  constructor(id?: number) {
    this._id = id;
    this.name = `Test2-${id}`;

    if (Types.isPresent(id)) {
      this.now = new ShortTime(id as Hour, 0);
    }
  }
}



@suite('core.serialization (with converter)')
class SerializerConverterTest extends SerializerBaseTest {

  @test 'should serialize null/undefined'() {
    const test = new TestConverter(11);

    const testSerialized = this.formatter.serialize(test);
    const testDeserialized = this.formatter.deserialize(testSerialized);
    expect(test).to.eql(testDeserialized);
  }

}