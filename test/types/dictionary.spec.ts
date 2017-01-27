require('reflect-metadata');

import * as chai from 'chai';
import { expect } from 'chai';
import { suite, test } from 'mocha-typescript';

import { AssertionError } from '../../src/util';

import { Dictionary  } from '../../src/types/dictionary';



class BaseClass {
    constructor(public name: string) {
    }
}


let expedtedTimes = [
];


@suite('Types.Dictionary')
class DictionaryTest {

    @test 'should create instance of Dictionary'() {
        return expect(new Dictionary<string, string>()).to.be.not.null;
    }
}