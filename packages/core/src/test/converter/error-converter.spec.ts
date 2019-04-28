// tslint:disable:member-access
// tslint:disable:max-classes-per-file

// tslint:disable-next-line:no-var-requires
import { expect } from 'chai';
import { suite, test } from 'mocha-typescript';

import { CloneVerifier } from '../../lib/base/clone-verifier';
import { Funktion } from '../../lib/base/objectType';
import { ConverterRegistry } from '../../lib/converter/converter-registry';
import { CoreUnitTest } from '../unit-test';


@suite('core.converter (Error converter)')
class ErrorConverterTest extends CoreUnitTest {

  @test 'should test empty instance'() {
    const value = new Error();
    this.testConversion(value, Error);
  }

  @test 'should test instance'() {
    const value = new Error('error message');
    this.testConversion(value, Error);
  }

  private testConversion(value: Error, type: Funktion) {
    const converter = ConverterRegistry.get<Error, Funktion>(type);
    // tslint:disable-next-line:no-unused-expression
    expect(converter).to.exist;

    const valueConverted = converter.convert(value);
    const valueConvertedBack = converter.convertBack(valueConverted);

    // CloneVerifier.verifyClone(value, valueConvertedBack);
    expect(valueConvertedBack).to.be.instanceOf(Error);

    expect(valueConvertedBack.message).to.equal(value.message);
    expect(valueConvertedBack.stack).to.equal(value.stack);

    // expect(valueConvertedBack).to.deep.equal(value);
  }

}