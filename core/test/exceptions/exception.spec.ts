// tslint:disable:max-classes-per-file
// tslint:disable:member-access
// tslint:disable:no-unused-expression


// tslint:disable-next-line:no-var-requires
require('reflect-metadata');

import { Injectable, InjectionToken, Injector } from 'injection-js';

import { expect } from 'chai';
import { suite, test } from 'mocha-typescript';

import { CoreInjector } from '../../src/di/core-injector';
import { FlxComponent } from '../../src/di/flx-component.decorator';
import { FlxModule } from '../../src/di/flx-module.decorator';
import { ModuleMetadataStorage } from '../../src/di/module-metadata-storage';
import { CoreUnitTest } from '../unit-test';
import { CoreTestModule } from '../unit-test';

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
class SimpleExceptionTests extends CoreUnitTest {
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

    innerExceptionTestCases.forEach((tst) => {
      const excInner = ExceptionFactory.create(tst.innerType, innerErrorText);
      const exc = ExceptionFactory.create(tst.type, errorText, excInner);

      const excSerialized = this.serializer.serialize(exc);
      const excDeserialized = this.serializer.deserialize(excSerialized);

      expect(excSerialized).to.exist;
      expect(excDeserialized).to.exist;
      expect(exc).to.deep.equal(excDeserialized);
    });
  }

}