// tslint:disable:member-access
// tslint:disable:max-classes-per-file

// tslint:disable-next-line:no-var-requires
import { expect } from 'chai';
import { suite, test } from 'mocha-typescript';

import { ConverterRegistry } from '../../src/converter';


@suite('core.converter (Error converter)')
class ErrorConverterTest {

  @test 'should test empty instance'() {
    const test = new Error();
    this.testConversion(test, Error);
  }

  @test 'should test instance'() {
    const test = new Error('error message');
    this.testConversion(test, Error);
  }

  private testConversion<T1, T2>(value: T1, type: Function) {
    const converter = ConverterRegistry.get<T1, T2>(type);
    expect(converter).to.exist;

    const valueConverted = converter.convert(value);
    const valueConvertedBack = converter.convertBack(valueConverted);

    expect(valueConvertedBack).to.deep.equal(value);
  }

}