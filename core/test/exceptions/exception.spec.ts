// tslint:disable:max-classes-per-file
// tslint:disable:member-access
// tslint:disable:no-unused-expression

import { expect } from 'chai';
import { suite, test } from 'mocha-typescript';

import { UnitTest } from '../../src/testing/unit-test';

import { ExceptionFactory } from '../../src/exceptions';
import { JsonSerializer } from '../../src/serialization/json-serializer';



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
class SimpleExceptionTests extends UnitTest {
  private serializer = new JsonSerializer();

  @test 'should create, serialize and deserialize simple exception'() {

    ExceptionFactory.exceptions.forEach((exception) => {
      const exc = new exception(errorText);
      const excSerialized = this.serializer.serialize(exc);
      const excDeserialized = this.serializer.deserialize(excSerialized);

      expect(excSerialized).to.exist;
      expect(excDeserialized).to.exist;
      expect(exc).to.deep.equal(excDeserialized);
    });
  }


  @test 'should create, serialize and deserialize simple exception (factory)'() {

    exceptionTypes.forEach((type) => {
      const exc = ExceptionFactory.create(type, errorText);

      const excSerialized = this.serializer.serialize(exc);
      const excDeserialized = this.serializer.deserialize(excSerialized);

      expect(excSerialized).to.exist;
      expect(excDeserialized).to.exist;
      expect(exc).to.deep.equal(excDeserialized);
    });
  }



  @test 'should create, serialize and deserialize exception with inner exception'() {

    innerExceptionTestCases.forEach((test) => {
      const excInner = ExceptionFactory.create(test.innerType, innerErrorText);
      const exc = ExceptionFactory.create(test.type, errorText, excInner);

      const excSerialized = this.serializer.serialize(exc);
      const excDeserialized = this.serializer.deserialize(excSerialized);

      expect(excSerialized).to.exist;
      expect(excDeserialized).to.exist;
      expect(exc).to.deep.equal(excDeserialized);
    });
  }

}