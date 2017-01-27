require('reflect-metadata');

import * as chai from 'chai';
import { expect } from 'chai';
import { suite, test } from 'mocha-typescript';

import { Dictionary } from '../../src/types/dictionary';

class KeyClass {
    constructor(public id: number) {
    }

    toString(): string {
        return `id-${this.id}`;
    }
}


class ValueClass {
    constructor(public name: string) {
    }
}


interface ITestData<TKey, TValue> {
    keys: TKey[];
    values: TValue[];
    noSuchKey: TKey;
}


class DictionaryTester<TKey, TValue> {

    public doTest(expected: ITestData<TKey, TValue>[]) {
        // @test 'validate keys vs values'() {
        expected.forEach(test => {
            expect(test.keys.length).to.be.equal(test.values.length);
        });


        // @test 'should add an item'() {
        expected.forEach(test => {
            let dict = new Dictionary<TKey, TValue>();

            for (let i = 0; i < test.keys.length; i++) {
                let key = test.keys[i];
                let value = test.values[i];

                expect(dict.add(key, value)).not.to.throw;
                expect(dict.count).to.be.equal(i + 1);
            }
        });


        // @test 'should remove an item'() {
        expected.forEach(test => {
            let dict = new Dictionary<TKey, TValue>();

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



        // @test 'should test for existence'() {
        expected.forEach(test => {
            let dict = new Dictionary<TKey, TValue>();

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


        // @test 'should test for non existence'() {
        expected.forEach(test => {
            let dict = new Dictionary<TKey, TValue>();

            for (let i = 0; i < test.keys.length; i++) {
                let key = test.keys[i];
                let value = test.values[i];

                dict.add(key, value);
            }

            expect(dict.containsKey(test.noSuchKey)).to.be.false;
        });


        // @test 'should test empty keys'() {
        expected.forEach(test => {
            let dict = new Dictionary<TKey, TValue>();
            expect(dict.keys.length).to.be.equal(0);
        });


        // @test 'should test empty values'() {
        expected.forEach(test => {
            let dict = new Dictionary<TKey, TValue>();
            expect(dict.values.length).to.be.equal(0);
        });


        // @test 'should test keys'() {
        expected.forEach(test => {
            let dict = new Dictionary<TKey, TValue>();

            for (let i = 0; i < test.keys.length; i++) {
                let key = test.keys[i];
                let value = test.values[i];

                dict.add(key, value);
            }

            expect(dict.keys.length).to.be.equal(test.keys.length);
            expect(dict.keys).to.be.deep.equal(test.keys);
        });

        // @test 'should test values'() {
        expected.forEach(test => {
            let dict = new Dictionary<TKey, TValue>();

            for (let i = 0; i < test.keys.length; i++) {
                let key = test.keys[i];
                let value = test.values[i];

                dict.add(key, value);
            }

            expect(dict.values.length).to.be.equal(test.values.length);
            expect(dict.values).to.be.deep.equal(test.values);
        });
    }
}


@suite('Types.Dictionary-generic')
class DictionaryGenericTest {

    @test 'should perform tests on Dictionary<string, string>'() {
        let tester = new DictionaryTester<string, string>();

        let testData: ITestData<string, string>[] = [
            {
                keys: [],
                values: [],
                noSuchKey: 'no-such-key'
            },
            {
                keys: ['key-00', 'key-01'],
                values: ['value-00', 'value-01'],
                noSuchKey: 'no-such-key'
            }
        ];

        tester.doTest(testData);
    }

    @test 'should perform tests on Dictionary<string, number>'() {
        let tester = new DictionaryTester<string, number>();

        let testData: ITestData<string, number>[] = [
            {
                keys: [],
                values: [],
                noSuchKey: 'no-such-key'
            },
            {
                keys: ['key-00', 'key-01'],
                values: [0, 1],
                noSuchKey: 'no-such-key'
            }
        ];

        tester.doTest(testData);
    }

    @test 'should perform tests on Dictionary<number, number>'() {
        let tester = new DictionaryTester<number, number>();

        let testData: ITestData<number, number>[] = [
            {
                keys: [],
                values: [],
                noSuchKey: -1
            },
            {
                keys: [0, 1],
                values: [100, 101],
                noSuchKey: -1
            }
        ];

        tester.doTest(testData);
    }


    @test 'should perform tests on Dictionary<string, ValueClass>'() {
        let tester = new DictionaryTester<string, ValueClass>();

        let testData: ITestData<string, ValueClass>[] = [
            {
                keys: [],
                values: [],
                noSuchKey: 'no-such-key'
            },
            {
                keys: ['key-00', 'key-01'],
                values: [new ValueClass('a'), new ValueClass('b')],
                noSuchKey: 'no-such-key'
            }
        ];

        tester.doTest(testData);
    }



    @test 'should perform tests on Dictionary<KeyClass, ValueClass>'() {
        let tester = new DictionaryTester<KeyClass, ValueClass>();

        let testData: ITestData<KeyClass, ValueClass>[] = [
            {
                keys: [],
                values: [],
                noSuchKey: new KeyClass(-1)
            },
            {
                keys: [new KeyClass(0), new KeyClass(1)],
                values: [new ValueClass('a'), new ValueClass('b')],
                noSuchKey: new KeyClass(-1)
            }
        ];

        tester.doTest(testData);
    }
}