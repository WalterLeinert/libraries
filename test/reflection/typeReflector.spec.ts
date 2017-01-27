require('reflect-metadata');

import * as chai from 'chai';
import { expect } from 'chai';
import { suite, test } from 'mocha-typescript';

import { AssertionError } from '../../src/util';

import { TypeReflector } from '../../src/reflection/typeReflector';



class BaseClass {
    constructor(public name: string) {
    }
}

class DerivedClass extends BaseClass {
    constructor(name: string, private id: number) {
        super(name);
    }
}



let expedtedTimes = [
];


@suite('ReflectionTypeReflector')
class ReflectionTest {

    @test 'should create instance of TypeReflector'() {
        let tr = new TypeReflector(BaseClass);
        return expect(tr).to.be.not.null;
    }
}