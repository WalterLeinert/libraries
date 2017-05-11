// tslint:disable:member-access
// tslint:disable:max-classes-per-file

import { expect } from 'chai';
import { suite, test } from 'mocha-typescript';


import { ConverterRegistry } from '../../src/converter';
import { Time } from '../../src/types/time';
import { Types } from '../../src/types/types';


class Test {
  public now: Time;

  constructor() {
    this.now = new Time(12, 13, 10);
  }
}


@suite('core.converter (Time converter)')
class TimeConverterTest {

  @test 'should test Time property'() {
    const test = new Test();
    expect(Types.isObject(test.now)).to.be.true;


    const typeName = Types.getClassName(test.now);

    const converter = ConverterRegistry.get(typeName);
    expect(converter).to.exist;

    expect(converter.convert(test.now)).to.eql('12:13:10');
    expect(converter.convertBack('12:13:10')).to.eql(test.now);
  }

}
