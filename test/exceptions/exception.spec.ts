// tslint:disable:max-classes-per-file
// tslint:disable:member-access

import { expect } from 'chai';
import { suite, test } from 'mocha-typescript';

import {
  Exception, ExceptionFactory
} from '../../src/exceptions';


const errorText = 'user not found';
const innerErrorText = 'inner error';

const exceptionTypes = [
  'ArgumentException',
  'AssertionException',
  'ClientException',
  'ConfigurationException',
  'InvalidOperationException',
  'NotImplementedException',
  'NotSupportedException',
  'ServerBusinessException',
  'ServerSystemException'
];

const innerExceptionTestCases = [
  {
    type: 'ServerBusinessException',
    innerType: 'ArgumentException'
  },

];


@suite('Exceptions: simple exceptions')
class SimpleExceptionTests {

  @test 'should encode/decode simple exception'() {

    exceptionTypes.forEach((type) => {
      const encoded = `{exc:${type}::${errorText}::}`;
      const expected = ExceptionFactory.create(type, errorText);

      const actual = Exception.decodeException(encoded);

      expect(actual).to.exist;
      expect(actual.message).to.equal(errorText);
      expect(actual.innerException).not.to.exist;
      expect(actual.type).to.equal(type);

      expect(actual.type).to.equal(expected.type);
      expect(actual.message).to.equal(expected.message);
    });
  }

}


@suite('Exceptions: inner exceptions')
class InnerExceptionTest {

  @test 'should encode/decode exceptions with inner exceptions'() {

    innerExceptionTestCases.forEach((test) => {
      const encoded = `{exc:${test.type}::${errorText}::{exc:${test.innerType}::${innerErrorText}::}}`;
      const expected = ExceptionFactory.create(test.type, errorText);
      const expectedInner = ExceptionFactory.create(test.innerType, innerErrorText);

      const actual = Exception.decodeException(encoded);

      expect(actual).to.exist;
      expect(actual.message).to.equal(errorText);
      expect(actual.innerException).to.exist;
      expect(actual.type).to.equal(test.type);

      expect(actual.type).to.equal(expected.type);
      expect(actual.message).to.equal(expected.message);

      // inner
      expect(actual.innerException.type).to.equal(test.innerType);
      expect(actual.innerException.message).to.equal(innerErrorText);

      expect(actual.innerException.type).to.equal(expectedInner.type);
      expect(actual.innerException.message).to.equal(expectedInner.message);
    });
  }

}