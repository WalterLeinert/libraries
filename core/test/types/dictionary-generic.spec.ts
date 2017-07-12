// tslint:disable:max-classes-per-file
// tslint:disable:member-access
// tslint:disable:no-unused-expression


import { expect } from 'chai';
import { suite, test } from 'mocha-typescript';

import { UniqueIdentifiable } from '../../src/base/uniqueIdentifiable';
import { CoreUnitTest } from '../unit-test';
import { Dictionary } from '../../src/types/dictionary';


class KeyClass extends UniqueIdentifiable {
  constructor(public id: number) {
    super();
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

  public doTest(expected: Array<ITestData<TKey, TValue>>) {
    // @test 'validate keys vs values'() {
    expected.forEach((tst) => {
      expect(tst.keys.length).to.be.equal(tst.values.length);
    });


    // @test 'should set an item'() {
    expected.forEach((tst) => {
      const dict = new Dictionary<TKey, TValue>();

      for (let i = 0; i < tst.keys.length; i++) {
        const key = tst.keys[i];
        const value = tst.values[i];

        expect(() => dict.set(key, value)).not.to.Throw();
        expect(dict.count).to.be.equal(i + 1);
      }
    });

    // @test 'should get an item'() {
    expected.forEach((tst) => {
      const dict = new Dictionary<TKey, TValue>();

      // tslint:disable-next-line:prefer-for-of
      for (let i = 0; i < tst.keys.length; i++) {
        const key = tst.keys[i];
        const value = tst.values[i];

        expect(() => dict.set(key, value)).not.to.Throw();
      }

      // tslint:disable-next-line:prefer-for-of
      for (let i = 0; i < tst.keys.length; i++) {
        const key = tst.keys[i];
        const value = tst.values[i];

        expect(dict.get(key)).to.deep.equal(value);
      }
    });


    // @test 'should remove an item'() {
    expected.forEach((tst) => {
      const dict = new Dictionary<TKey, TValue>();

      // tslint:disable-next-line:prefer-for-of
      for (let i = 0; i < tst.keys.length; i++) {
        const key = tst.keys[i];
        const value = tst.values[i];

        dict.set(key, value);
      }

      for (let i = 0; i < tst.keys.length; i++) {
        const key = tst.keys[i];

        expect(() => dict.remove(key)).not.to.Throw();
        expect(dict.count).to.be.equal(tst.keys.length - (i + 1));
      }
    });



    // @test 'should test for existence'() {
    expected.forEach((tst) => {
      const dict = new Dictionary<TKey, TValue>();

      // tslint:disable-next-line:prefer-for-of
      for (let i = 0; i < tst.keys.length; i++) {
        const key = tst.keys[i];
        const value = tst.values[i];

        dict.set(key, value);
      }

      // tslint:disable-next-line:prefer-for-of
      for (let i = 0; i < tst.keys.length; i++) {
        const key = tst.keys[i];
        expect(dict.containsKey(key)).to.be.true;
      }
    });


    // @test 'should test for non existence'() {
    expected.forEach((tst) => {
      const dict = new Dictionary<TKey, TValue>();

      // tslint:disable-next-line:prefer-for-of
      for (let i = 0; i < tst.keys.length; i++) {
        const key = tst.keys[i];
        const value = tst.values[i];

        dict.set(key, value);
      }

      expect(dict.containsKey(tst.noSuchKey)).to.be.false;
    });


    // @test 'should test empty keys'() {
    expected.forEach((tst) => {
      const dict = new Dictionary<TKey, TValue>();
      expect(dict.keys.length).to.be.equal(0);
    });


    // @test 'should test empty values'() {
    expected.forEach((tst) => {
      const dict = new Dictionary<TKey, TValue>();
      expect(dict.values.length).to.be.equal(0);
    });


    // @test 'should test keys'() {
    expected.forEach((tst) => {
      const dict = new Dictionary<TKey, TValue>();

      // tslint:disable-next-line:prefer-for-of
      for (let i = 0; i < tst.keys.length; i++) {
        const key = tst.keys[i];
        const value = tst.values[i];

        dict.set(key, value);
      }

      expect(dict.keys.length).to.be.equal(tst.keys.length);
      expect(dict.keys).to.be.deep.equal(tst.keys);
    });

    // @test 'should test values'() {
    expected.forEach((tst) => {
      const dict = new Dictionary<TKey, TValue>();

      // tslint:disable-next-line:prefer-for-of
      for (let i = 0; i < tst.keys.length; i++) {
        const key = tst.keys[i];
        const value = tst.values[i];

        dict.set(key, value);
      }

      expect(dict.values.length).to.be.equal(tst.values.length);
      expect(dict.values).to.be.deep.equal(tst.values);
    });


    // @test 'should test clear'() {
    expected.forEach((tst) => {
      const dict = new Dictionary<TKey, TValue>();

      // tslint:disable-next-line:prefer-for-of
      for (let i = 0; i < tst.keys.length; i++) {
        const key = tst.keys[i];
        const value = tst.values[i];

        dict.set(key, value);
      }

      expect(() => dict.clear()).to.not.Throw();
      expect(dict.count).to.be.equal(0);
    });


    // @test 'should test isEmpty'() {
    expected.forEach((tst) => {
      const dict = new Dictionary<TKey, TValue>();

      expect(dict.isEmpty).to.be.true;

      // tslint:disable-next-line:prefer-for-of
      for (let i = 0; i < tst.keys.length; i++) {
        const key = tst.keys[i];
        const value = tst.values[i];

        dict.set(key, value);
      }

      dict.clear();
      expect(dict.isEmpty).to.be.true;
    });
  }
}


@suite('core.types.Dictionary-generic')
class DictionaryGenericTest extends CoreUnitTest {

  @test 'should perform tests on Dictionary<string, string>'() {
    const tester = new DictionaryTester<string, string>();

    const testData: Array<ITestData<string, string>> = [
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
    const tester = new DictionaryTester<string, number>();

    const testData: Array<ITestData<string, number>> = [
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
    const tester = new DictionaryTester<number, number>();

    const testData: Array<ITestData<number, number>> = [
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
    const tester = new DictionaryTester<string, ValueClass>();

    const testData: Array<ITestData<string, ValueClass>> = [
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
    const tester = new DictionaryTester<KeyClass, ValueClass>();

    const testData: Array<ITestData<KeyClass, ValueClass>> = [
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