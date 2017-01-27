import path = require('path');
import process = require('process');

import * as chai from 'chai';
import { expect } from 'chai';
import { suite, test } from 'mocha-typescript';


import { AssertionError } from '../../src/util';
import { Time } from '../../src/types/time';

import { Reflection } from '../../src/util';


@suite('Util.Reflection')
class ReflectionTest {

    @test 'should test copyProperties'() {
        // todo
    }
}