// tslint:disable:member-access
// tslint:disable:max-classes-per-file

import { expect } from 'chai';
import { suite, test } from 'mocha-typescript';


import { ConverterMetadataStorage } from '../../src/converter';
import { Time } from '../../src/types/time';
import { TIME_CONVERTER } from '../../src/types/time.converter';
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

    const timeMetadata = ConverterMetadataStorage.instance.findClassConverterMetadata(typeName);
    expect(timeMetadata).to.exist;

    expect(timeMetadata.key).to.eql(TIME_CONVERTER);

    const converterTuple = timeMetadata.getConverterTuple<string, Time>();
    expect(converterTuple.to.convert(test.now)).to.eql('12:13:10');

    expect(converterTuple.from.convert('12:13:10')).to.eql(test.now);
  }

}
