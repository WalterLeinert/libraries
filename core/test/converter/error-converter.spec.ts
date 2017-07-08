// tslint:disable:member-access
// tslint:disable:max-classes-per-file

// tslint:disable-next-line:no-var-requires
import { expect } from 'chai';
import { suite, test } from 'mocha-typescript';

import { Funktion } from '../../src/base/objectType';
import { ConverterRegistry } from '../../src/converter/converter-registry';
import { UnitTest } from '../../src/testing/unit-test';


@suite('core.converter (Error converter)')
class ErrorConverterTest extends UnitTest {

  @test 'should test empty instance'() {
    const value = new Error();
    this.testConversion(value, Error);
  }

  @test 'should test instance'() {
    const value = new Error('error message');
    this.testConversion(value, Error);
  }

  private testConversion<T1, T2>(value: T1, type: Funktion) {
    const converter = ConverterRegistry.get<T1, T2>(type);
    // tslint:disable-next-line:no-unused-expression
    expect(converter).to.exist;

    const valueConverted = converter.convert(value);
    const valueConvertedBack = converter.convertBack(valueConverted);

    expect(valueConvertedBack).to.deep.equal(value);
  }

}