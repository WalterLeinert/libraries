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
  'EntityExistsException',
  'EntityNotFoundException',
  'InvalidOperationException',
  'NotImplementedException',
  'NotSupportedException',
  'OptimisticLockException',
  'ServerBusinessException',
  'ServerSystemException'
];

const innerExceptionTestCases = [
  {
    type: 'ServerBusinessException',
    innerType: 'ArgumentException'
  },

];


@suite('core.exceptions: simple exceptions')
class SimpleExceptionTests {

  @test 'should encode/decode simple exception'() {

    exceptionTypes.forEach((type) => {
      const encoded = `{exc:${type}::${errorText}::}`;
      const expected = ExceptionFactory.create(type, errorText);

      const actual = Exception.decodeException(encoded);

      expect(actual).to.exist;
      expect(actual.message).to.equal(errorText);
      expect(actual.innerException).not.to.exist;
      expect(actual.kind).to.equal(type);

      expect(actual.kind).to.equal(expected.kind);
      expect(actual.message).to.equal(expected.message);
    });
  }

}


@suite('core.exceptions: inner exceptions')
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
      expect(actual.kind).to.equal(test.type);

      expect(actual.kind).to.equal(expected.kind);
      expect(actual.message).to.equal(expected.message);

      // inner
      expect(actual.innerException.kind).to.equal(test.innerType);
      expect(actual.innerException.message).to.equal(innerErrorText);

      expect(actual.innerException.kind).to.equal(expectedInner.kind);
      expect(actual.innerException.message).to.equal(expectedInner.message);
    });
  }

}