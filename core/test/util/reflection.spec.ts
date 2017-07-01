// tslint:disable:max-classes-per-file
// tslint:disable:member-access
// tslint:disable:no-unused-variable

import path = require('path');
import process = require('process');

import * as chai from 'chai';
import { expect } from 'chai';
import { suite, test } from 'mocha-typescript';

import { UnitTest } from '../../src/testing/unit-test';
import { Reflection } from '../../src/util';


@suite('core.util.Reflection')
class ReflectionTest extends UnitTest {

  @test 'should test copyProperties'() {
    // todo
  }
}