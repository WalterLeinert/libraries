// tslint:disable:max-classes-per-file
// tslint:disable:member-access

// tslint:disable-next-line:no-var-requires
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


@suite('ReflectionTypeReflector')
class ReflectionTest {

    @test 'should create instance of TypeReflector'() {
        const tr = new TypeReflector(BaseClass);
        return expect(tr).to.be.not.null;
    }
}