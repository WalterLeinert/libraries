// tslint:disable:member-access
// tslint:disable:max-classes-per-file
// tslint:disable:no-unused-expression

import { expect } from 'chai';
import { suite, test } from 'mocha-typescript';


import { ConverterRegistry } from '../../lib/converter';
import { Time } from '../../lib/types/time';
import { Types } from '../../lib/types/types';
import { CoreUnitTest } from '../unit-test';


class Test {
  public now: Time;

  constructor() {
    this.now = new Time(12, 13, 10);
  }
}


@suite('core.converter (Time converter)')
class TimeConverterTest extends CoreUnitTest {

  @test 'should test Time property'() {
    const value = new Test();
    expect(Types.isObject(value.now)).to.be.true;


    const typeName = Types.getClassName(value.now);

    const converter = ConverterRegistry.get(typeName);
    expect(converter).to.exist;

    expect(converter.convert(value.now)).to.eql('12:13:10');
    expect(converter.convertBack('12:13:10')).to.eql(value.now);
  }

}