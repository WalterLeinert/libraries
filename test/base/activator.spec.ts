require('reflect-metadata');

import * as chai from 'chai';
import { expect } from 'chai';
import { suite, test } from 'mocha-typescript';


import { Activator } from '../../src/base/activator';

class Test {
    constructor(public name: string, public id: number) {
    }
}

class Test2 {
    constructor() {
    }
}

@suite('Activator')
class ActivatorTest {

    @test 'should create instance of class Test'() {
        let expectedTest = new Test('hugo', 4711);
        return expect(Activator.createInstance<Test>(Test, expectedTest.name, expectedTest.id)).to.be.eql(expectedTest);
    }


    @test 'should create instance of class Test: 2nd parameter missing'() {
        let expectedTest = new Test('hugo', undefined);
        return expect(Activator.createInstance<Test>(Test, expectedTest.name)).to.be.eql(expectedTest);
    }

    @test 'should create instance of class Test: all parameters missing'() {
        let expectedTest = new Test(undefined, undefined);
        return expect(Activator.createInstance<Test>(Test)).to.be.eql(expectedTest);
    }

    @test 'should create instance of class Test2'() {
        return expect(Activator.createInstance<Test2>(Test2)).to.be.not.null;
    }
}