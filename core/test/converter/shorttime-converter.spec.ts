// tslint:disable:member-access
// tslint:disable:max-classes-per-file

import { expect } from 'chai';
import { suite, test } from 'mocha-typescript';


import { ConverterMetadataStorage } from '../../src/converter';
import { ShortTime } from '../../src/types/shortTime';
import { SHORTTIME_CONVERTER } from '../../src/types/shortTime.converter';
import { Types } from '../../src/types/types';


class Test {
  public now: ShortTime;

  constructor() {
    this.now = new ShortTime(19, 15);
  }
}


@suite('core.converter (ShortTime converter)')
class TimeConverterTest {

  @test 'should test ShortTime property'() {
    const test = new Test();
    expect(Types.isObject(test.now)).to.be.true;

    const typeName = Types.getClassName(test.now);

    const timeMetadata = ConverterMetadataStorage.instance.findClassConverterMetadata(typeName);
    expect(timeMetadata).to.exist;

    expect(timeMetadata.key).to.eql(SHORTTIME_CONVERTER);

    const converterTuple = timeMetadata.getConverterTuple<string, ShortTime>();
    expect(converterTuple.to.convert(test.now)).to.eql('19:15');

    expect(converterTuple.from.convert('19:15')).to.eql(test.now);
  }

}
