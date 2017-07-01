// tslint:disable:member-access
// tslint:disable:max-classes-per-file
// tslint:disable:no-unused-expression

import { expect } from 'chai';
import { suite, test } from 'mocha-typescript';


import { ConverterRegistry } from '../../src/converter';
import { UnitTest } from '../../src/testing/unit-test';
import { ShortTime } from '../../src/types/shortTime';
import { Types } from '../../src/types/types';


class Test {
  public now: ShortTime;

  constructor() {
    this.now = new ShortTime(19, 15);
  }
}


@suite('core.converter (ShortTime converter)')
class TimeConverterTest extends UnitTest {

  @test 'should test ShortTime property'() {
    const test = new Test();
    expect(Types.isObject(test.now)).to.be.true;

    const typeName = Types.getClassName(test.now);

    const converter = ConverterRegistry.get(typeName);
    expect(converter).to.exist;

    expect(converter.convert(test.now)).to.eql('19:15');
    expect(converter.convertBack('19:15')).to.eql(test.now);
  }

}
