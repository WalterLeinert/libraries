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


@suite('Types.Dictionary<string, string>')
class DictionarySimpleTest {

    @test 'should create instance of Dictionary'() {
        return expect(new Dictionary<string, string>()).to.be.not.null;
    }

    @test 'should add an item'() {
        let d = new Dictionary<string, string>();
        expect(d.add('aaa', 'bbb')).not.to.throw;
        expect(d.count).to.be.equal(1);
    }

    @test 'should remove an item'() {
        let d = new Dictionary<string, string>();
        let key = 'aaa';
        d.add(key, 'bbb');
        expect(d.remove(key)).not.to.throw;
        expect(d.count).to.be.equal(0);
    }

    @test 'should test for existence'() {
        let d = new Dictionary<string, string>();
        let key = 'aaa';
        d.add(key, 'bbb');
        expect(d.containsKey(key)).to.be.true;
    }

    @test 'should test for not existence'() {
        let d = new Dictionary<string, string>();
        let key = 'aaa';
        d.add(key, 'bbb');
        expect(d.containsKey('no-such-key')).to.be.false;
    }

    @test 'should test empty keys'() {
        let d = new Dictionary<string, string>();
        expect(d.keys.length).to.be.equal(0);
    }

    @test 'should test empty values'() {
        let d = new Dictionary<string, string>();
        expect(d.values.length).to.be.equal(0);
    }

    @test 'should test keys'() {
        let d = new Dictionary<string, string>();
        let key = 'aaa';
        let value = 'bbb';
        d.add(key, value);
        expect(d.keys.length).to.be.equal(1);
        expect(d.keys[0]).to.be.equal(key);
    }

    @test 'should test values'() {
        let d = new Dictionary<string, string>();
        let key = 'aaa';
        let value = 'bbb';
        d.add(key, value);
        expect(d.values.length).to.be.equal(1);
        expect(d.values[0]).to.be.equal(value);
    }
}

@suite('Types.Dictionary')
class DictionaryTest {

    @test 'should create instance of Dictionary'() {
        return expect(new Dictionary<string, string>()).to.be.not.null;
    }
}