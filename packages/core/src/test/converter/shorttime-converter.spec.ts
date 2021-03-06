// tslint:disable:member-access
// tslint:disable:max-classes-per-file
// tslint:disable:no-unused-expression

import { expect } from 'chai';
import { suite, test } from 'mocha-typescript';


import { ConverterRegistry } from '../../lib/converter';
import { ShortTime } from '../../lib/types/shortTime';
import { Types } from '../../lib/types/types';
import { CoreUnitTest } from '../unit-test';


class Test {
  public now: ShortTime;

  constructor() {
    this.now = new ShortTime(19, 15);
  }
}


@suite('core.converter (ShortTime converter)')
class TimeConverterTest extends CoreUnitTest {

  @test 'should test ShortTime property'() {
    const value = new Test();
    expect(Types.isObject(value.now)).to.be.true;

    const typeName = Types.getClassName(value.now);

    const converter = ConverterRegistry.get(typeName);
    expect(converter).to.exist;

    expect(converter.convert(value.now)).to.eql('19:15');
    expect(converter.convertBack('19:15')).to.eql(value.now);
  }

}
