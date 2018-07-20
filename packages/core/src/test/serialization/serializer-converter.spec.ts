// tslint:disable:member-access
// tslint:disable:max-classes-per-file

import { expect } from 'chai';
import { suite, test } from 'mocha-typescript';

import { Serializable } from '../../lib/serialization';
import { Hour, ShortTime, Types } from '../../lib/types';
import { SerializerBaseTest } from './serializer-base-test';


@Serializable()
class TestConverter {

  @Serializable()
  private _id: number;

  @Serializable()
  public name: string;

  public now: ShortTime;

  public created: Date;

  constructor(id?: number) {
    this._id = id;
    this.name = `Test2-${id}`;

    if (Types.isPresent(id)) {
      this.now = new ShortTime(id as Hour, 0);
    }
    this.created = new Date();
  }
}



@suite('core.serialization (with converter)')
class SerializerConverterTest extends SerializerBaseTest {

  @test 'should serialize null/undefined'() {
    const value = new TestConverter(11);

    const testSerialized = this.formatter.serialize(value);
    const testDeserialized = this.formatter.deserialize(testSerialized);
    expect(value).to.eql(testDeserialized);
  }

}