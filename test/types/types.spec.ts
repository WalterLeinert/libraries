require('reflect-metadata');

import * as chai from 'chai';
import { expect } from 'chai';
import { suite, test } from 'mocha-typescript';

import { AssertionError } from '../../src/util';

import { Types } from '../../src/types';




@suite('Types')
class TypesTest {

    @test 'should test various types'() {
        expect(Types.isArray([1, 2])).to.be.true;
        expect(Types.isFunction(function(){})).to.be.true;
        expect(Types.isBoolean(true)).to.be.true;
        expect(Types.isNumber(4711)).to.be.true;
        expect(Types.isObject({ name: 'hugo' })).to.be.true;
        expect(Types.isString('hugo')).to.be.true;
        expect(Types.isSymbol(Symbol('hugo'))).to.be.true;

        expect(Types.isNull(null)).to.be.true;
        expect(Types.isUndefined(undefined)).to.be.true;
    }

}