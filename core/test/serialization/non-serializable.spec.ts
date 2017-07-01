// tslint:disable:member-access
// tslint:disable:max-classes-per-file
// tslint:disable:no-unused-expression

import { expect } from 'chai';
import { suite, test } from 'mocha-typescript';

import { Serializable } from '../../src/serialization';
import { SerializerBaseTest } from './serializer-base-test';


@Serializable()
class TestNonSerializable {

  @Serializable()
  public firstname: string;

  @Serializable()
  public lastname: string;

  // calculated property -> non serializable
  @Serializable(false)
  public internal: number;

  constructor(firstname?: string, lastname?: string) {
    this.firstname = firstname;
    this.lastname = lastname;
    if (this.firstname) {
      this.internal = this.firstname.length;
    }
  }
}



@suite('core.serialization (non serializable)')
class NonSerializableTest extends SerializerBaseTest {

  @test 'should skip non serializable property'() {
    const test = new TestNonSerializable('hugo', 'hirsch');

    const testSerialized = this.formatter.serialize(test);
    const testDeserialized = this.formatter.deserialize(testSerialized);

    expect(test.firstname).to.equal((testDeserialized as any).firstname);
    expect(test.lastname).to.equal((testDeserialized as any).lastname);
    expect(test.internal).to.exist;
    expect((testDeserialized as any).internal).to.not.exist;
  }

}
