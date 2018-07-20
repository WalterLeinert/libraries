// tslint:disable:max-classes-per-file
// tslint:disable:member-access
// tslint:disable:no-unused-expression

import { expect } from 'chai';
import { suite, test } from 'mocha-typescript';

import { Dictionary } from '../../lib/types/dictionary';
import { CoreUnitTest } from '../unit-test';


class BaseClass {
  constructor(public name: string) {
  }
}


const expectedDict = [
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


@suite('core.types.Dictionary<string, string>')
class DictionaryStringStringTest<TKey, TValue> extends CoreUnitTest {
  @test 'should create instance of Dictionary'() {
    return expect(new Dictionary<string, string>()).to.be.not.null;
  }

  @test 'should set an item'() {
    const d = new Dictionary<string, string>();
    expect(() => d.set('aaa', 'bbb')).not.to.Throw();
    expect(d.count).to.be.equal(1);
  }

  @test 'should set an item twice'() {
    const d = new Dictionary<string, string>();
    expect(() => d.set('aaa', 'bbb')).not.to.Throw();
    expect(() => d.set('aaa', 'ccc')).not.to.Throw();
  }

  @test 'should get an item'() {
    const d = new Dictionary<string, string>();
    d.set('aaa', 'bbb');
    expect(d.get('aaa')).to.be.equal('bbb');
  }

  @test 'should get a non existing item'() {
    const d = new Dictionary<string, string>();
    expect(d.get('aaa')).to.be.undefined;
  }

  @test 'should remove an item'() {
    const d = new Dictionary<string, string>();
    const key = 'aaa';
    d.set(key, 'bbb');
    expect(() => d.remove(key)).not.to.Throw();
    expect(d.count).to.be.equal(0);
  }

  @test 'should remove an item twice'() {
    const d = new Dictionary<string, string>();
    const key = 'aaa';
    d.set(key, 'bbb');
    expect(() => d.remove(key)).not.to.Throw();
    expect(() => d.remove(key)).not.to.Throw();
  }

  @test 'should test for existence'() {
    const d = new Dictionary<string, string>();
    const key = 'aaa';
    d.set(key, 'bbb');
    expect(d.containsKey(key)).to.be.true;
  }

  @test 'should test for not existence'() {
    const d = new Dictionary<string, string>();
    const key = 'aaa';
    d.set(key, 'bbb');
    expect(d.containsKey('no-such-key')).to.be.false;
  }

  @test 'should test empty keys'() {
    const d = new Dictionary<string, string>();
    expect(d.keys.length).to.be.equal(0);
  }

  @test 'should test empty values'() {
    const d = new Dictionary<string, string>();
    expect(d.values.length).to.be.equal(0);
  }

  @test 'should test keys'() {
    const d = new Dictionary<string, string>();
    const key = 'aaa';
    const value = 'bbb';
    d.set(key, value);
    expect(d.keys.length).to.be.equal(1);
    expect(d.keys[0]).to.be.equal(key);
  }

  @test 'should test values'() {
    const d = new Dictionary<string, string>();
    const key = 'aaa';
    const value = 'bbb';
    d.set(key, value);
    expect(d.values.length).to.be.equal(1);
    expect(d.values[0]).to.be.equal(value);
  }
}


@suite('core.types.Dictionary')
class DictionaryTest extends CoreUnitTest {

  @test 'validate keys vs values'() {
    expectedDict.forEach((tst) => {
      expect(tst.keys.length).to.be.equal(tst.values.length);
    });
  }

  @test 'should set an item'() {
    expectedDict.forEach((tst) => {
      const dict = tst.dictCreator();

      for (let i = 0; i < tst.keys.length; i++) {
        const key = tst.keys[i];
        const value = tst.values[i];

        expect(() => dict.set(key, value)).not.to.Throw();
        expect(dict.count).to.be.equal(i + 1);
      }
    });
  }


  @test 'should remove an item'() {
    expectedDict.forEach((tst) => {
      const dict = tst.dictCreator();

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
  }


  @test 'should test for existence'() {
    expectedDict.forEach((tst) => {
      const dict = tst.dictCreator();

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
  }

  @test 'should test for non existence'() {
    expectedDict.forEach((tst) => {
      const dict = tst.dictCreator();

      // tslint:disable-next-line:prefer-for-of
      for (let i = 0; i < tst.keys.length; i++) {
        const key = tst.keys[i];
        const value = tst.values[i];

        dict.set(key, value);
      }

      expect(dict.containsKey('no-such-key')).to.be.false;
    });
  }

  @test 'should test empty keys'() {
    expectedDict.forEach((tst) => {
      const dict = tst.dictCreator();
      expect(dict.keys.length).to.be.equal(0);
    });
  }

  @test 'should test empty values'() {
    expectedDict.forEach((tst) => {
      const dict = tst.dictCreator();
      expect(dict.values.length).to.be.equal(0);
    });
  }

  @test 'should test keys'() {
    expectedDict.forEach((tst) => {
      const dict = tst.dictCreator();

      // tslint:disable-next-line:prefer-for-of
      for (let i = 0; i < tst.keys.length; i++) {
        const key = tst.keys[i];
        const value = tst.values[i];

        dict.set(key, value);
      }

      expect(dict.keys.length).to.be.equal(tst.keys.length);
      expect(dict.keys).to.be.deep.equal(tst.keys);
    });
  }

  @test 'should test values'() {
    expectedDict.forEach((tst) => {
      const dict = tst.dictCreator();

      // tslint:disable-next-line:prefer-for-of
      for (let i = 0; i < tst.keys.length; i++) {
        const key = tst.keys[i];
        const value = tst.values[i];

        dict.set(key, value);
      }

      expect(dict.values.length).to.be.equal(tst.values.length);
      expect(dict.values).to.be.deep.equal(tst.values);
    });
  }

  @test 'should test clear'() {
    expectedDict.forEach((tst) => {
      const dict = tst.dictCreator();

      // tslint:disable-next-line:prefer-for-of
      for (let i = 0; i < tst.keys.length; i++) {
        const key = tst.keys[i];
        const value = tst.values[i];

        dict.set(key, value);
      }

      expect(dict.clear()).to.not.throw;
      expect(dict.count).to.be.equal(0);
    });
  }
}



class ObjectKey {
  public id: number;
}

@suite('core.types.Dictionary: object keys')
class DictionaryNotSupportedTest extends CoreUnitTest {

  @test 'should create instance of Dictionary'() {
    return expect(new Dictionary<ObjectKey, string>()).to.be.not.null;
  }

  @test 'should set an item'() {
    const d = new Dictionary<ObjectKey, string>();
    const key = new ObjectKey();
    expect(() => d.set(key, 'bbb')).not.to.Throw();
    expect(d.count).to.be.equal(1);
  }

  @test 'should remove an item'() {
    const d = new Dictionary<ObjectKey, string>();
    const key = new ObjectKey();
    expect(() => d.remove(key)).not.to.Throw();
    expect(d.count).to.be.equal(0);
  }

  @test 'should test for existence'() {
    const d = new Dictionary<ObjectKey, string>();
    const key = new ObjectKey();
    expect(() => d.containsKey(key)).not.to.Throw();
  }

}