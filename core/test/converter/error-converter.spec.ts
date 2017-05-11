// tslint:disable:member-access
// tslint:disable:max-classes-per-file

import { expect } from 'chai';
import { only, suite, test } from 'mocha-typescript';


import { ConverterRegistry } from '../../src/converter';

@only
@suite('core.converter (Error converter)')
class ErrorConverterTest {

  @test 'should test Error instance'() {
    const test = new Error('error message');
    test.name = 'error-name';
    const converter = ConverterRegistry.get<Error, String>(Error);
    expect(converter).to.exist;

    const testConverted = converter.convert(test);
    const testConvertedBack = converter.convertBack(testConverted);

    expect(testConvertedBack).to.deep.equal(test);
  }

}