// tslint:disable:max-classes-per-file
// tslint:disable:member-access

import path = require('path');
import process = require('process');

import * as chai from 'chai';
import { expect } from 'chai';
import { suite, test } from 'mocha-typescript';


import { Time } from '../../src/types/time';
import { AssertionError } from '../../src/util';

import { Reflection } from '../../src/util';


@suite('Util.Reflection')
class ReflectionTest {

    @test 'should test copyProperties'() {
        // todo
    }
}