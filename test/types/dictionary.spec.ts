require('reflect-metadata');

import * as chai from 'chai';
import { expect } from 'chai';
import { suite, test } from 'mocha-typescript';

import { Dictionary } from '../../src/types/dictionary';

class BaseClass {
    constructor(public name: string) {
    }
}


let expectedDict = [
    {
        dictCreator: () => new Dictionary<string, string>(),
        keys: ['key-0', 'key-1'],
        values: ['value-0', 'value-1']
    },
    {
        dictCreator: () => new Dictionary<string, string>(),
        keys: [],
        values: []
    }
];


@suite('Types.Dictionary<string, string>')
class DictionaryStringStringTest<TKey, TValue> {
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

    @test 'validate keys vs values'() {
        expectedDict.forEach(test => {
            expect(test.keys.length).to.be.equal(test.values.length);
        });
    }

    @test 'should add an item'() {
        expectedDict.forEach(test => {
            let dict = test.dictCreator();

            for (let i = 0; i < test.keys.length; i++) {
                let key = test.keys[i];
                let value = test.values[i];

                expect(dict.add(key, value)).not.to.throw;
                expect(dict.count).to.be.equal(i + 1);
            }
        });
    }


    @test 'should remove an item'() {
        expectedDict.forEach(test => {
            let dict = test.dictCreator();

            for (let i = 0; i < test.keys.length; i++) {
                let key = test.keys[i];
                let value = test.values[i];

                dict.add(key, value);
            }

            for (let i = 0; i < test.keys.length; i++) {
                let key = test.keys[i];
                let value = test.values[i];

                expect(dict.remove(key)).not.to.throw;
                expect(dict.count).to.be.equal(test.keys.length - (i + 1));
            }
        });
    }


    @test 'should test for existence'() {
        expectedDict.forEach(test => {
            let dict = test.dictCreator();

            for (let i = 0; i < test.keys.length; i++) {
                let key = test.keys[i];
                let value = test.values[i];

                dict.add(key, value);
            }

            for (let i = 0; i < test.keys.length; i++) {
                let key = test.keys[i];
                let value = test.values[i];

                expect(dict.containsKey(key)).to.be.true;
            }
        });
    }

    @test 'should test for non existence'() {
        expectedDict.forEach(test => {
            let dict = test.dictCreator();

            for (let i = 0; i < test.keys.length; i++) {
                let key = test.keys[i];
                let value = test.values[i];

                dict.add(key, value);
            }

            expect(dict.containsKey('no-such-key')).to.be.false;
        });
    }

    @test 'should test empty keys'() {
        expectedDict.forEach(test => {
            let dict = test.dictCreator();
            expect(dict.keys.length).to.be.equal(0);
        });
    }

    @test 'should test empty values'() {
        expectedDict.forEach(test => {
            let dict = test.dictCreator();
            expect(dict.values.length).to.be.equal(0);
        });
    }

    @test 'should test keys'() {
        expectedDict.forEach(test => {
            let dict = test.dictCreator();

            for (let i = 0; i < test.keys.length; i++) {
                let key = test.keys[i];
                let value = test.values[i];

                dict.add(key, value);
            }

            expect(dict.keys.length).to.be.equal(test.keys.length);
            expect(dict.keys).to.be.deep.equal(test.keys);
        });
    }

    @test 'should test values'() {
        expectedDict.forEach(test => {
            let dict = test.dictCreator();

            for (let i = 0; i < test.keys.length; i++) {
                let key = test.keys[i];
                let value = test.values[i];

                dict.add(key, value);
            }

            expect(dict.values.length).to.be.equal(test.values.length);
            expect(dict.values).to.be.deep.equal(test.values);
        });
    }

    @test 'should test clear'() {
        expectedDict.forEach(test => {
            let dict = test.dictCreator();

            for (let i = 0; i < test.keys.length; i++) {
                let key = test.keys[i];
                let value = test.values[i];

                dict.add(key, value);
            }

            expect(dict.clear()).to.not.throw;
            expect(dict.count).to.be.equal(0);
        });
    }
}