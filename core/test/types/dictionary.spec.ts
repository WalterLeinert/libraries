// tslint:disable:max-classes-per-file
// tslint:disable:member-access
// tslint:disable:no-unused-expression

import { expect } from 'chai';
import { suite, test } from 'mocha-typescript';

import { UnitTest } from '../../src/testing/unit-test';
import { Dictionary } from '../../src/types/dictionary';


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
class DictionaryStringStringTest<TKey, TValue> extends UnitTest {
  @test 'should create instance of Dictionary'() {
    return expect(new Dictionary<string, string>()).to.be.not.null;
  }

  @test 'should set an item'() {
    const d = new Dictionary<string, string>();
    expect(() => d.set('aaa', 'bbb')).not.to.Throw();
    expect(d.count).to.be.equal(1);
  }

  @test 'should remove an item'() {
    const d = new Dictionary<string, string>();
    const key = 'aaa';
    d.set(key, 'bbb');
    expect(() => d.remove(key)).not.to.Throw();
    expect(d.count).to.be.equal(0);
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
class DictionaryTest extends UnitTest {

  @test 'validate keys vs values'() {
    expectedDict.forEach((test) => {
      expect(test.keys.length).to.be.equal(test.values.length);
    });
  }

  @test 'should set an item'() {
    expectedDict.forEach((test) => {
      const dict = test.dictCreator();

      for (let i = 0; i < test.keys.length; i++) {
        const key = test.keys[i];
        const value = test.values[i];

        expect(() => dict.set(key, value)).not.to.Throw();
        expect(dict.count).to.be.equal(i + 1);
      }
    });
  }


  @test 'should remove an item'() {
    expectedDict.forEach((test) => {
      const dict = test.dictCreator();

      // tslint:disable-next-line:prefer-for-of
      for (let i = 0; i < test.keys.length; i++) {
        const key = test.keys[i];
        const value = test.values[i];

        dict.set(key, value);
      }

      for (let i = 0; i < test.keys.length; i++) {
        const key = test.keys[i];

        expect(() => dict.remove(key)).not.to.Throw();
        expect(dict.count).to.be.equal(test.keys.length - (i + 1));
      }
    });
  }


  @test 'should test for existence'() {
    expectedDict.forEach((test) => {
      const dict = test.dictCreator();

      // tslint:disable-next-line:prefer-for-of
      for (let i = 0; i < test.keys.length; i++) {
        const key = test.keys[i];
        const value = test.values[i];

        dict.set(key, value);
      }

      // tslint:disable-next-line:prefer-for-of
      for (let i = 0; i < test.keys.length; i++) {
        const key = test.keys[i];
        expect(dict.containsKey(key)).to.be.true;
      }
    });
  }

  @test 'should test for non existence'() {
    expectedDict.forEach((test) => {
      const dict = test.dictCreator();

      // tslint:disable-next-line:prefer-for-of
      for (let i = 0; i < test.keys.length; i++) {
        const key = test.keys[i];
        const value = test.values[i];

        dict.set(key, value);
      }

      expect(dict.containsKey('no-such-key')).to.be.false;
    });
  }

  @test 'should test empty keys'() {
    expectedDict.forEach((test) => {
      const dict = test.dictCreator();
      expect(dict.keys.length).to.be.equal(0);
    });
  }

  @test 'should test empty values'() {
    expectedDict.forEach((test) => {
      const dict = test.dictCreator();
      expect(dict.values.length).to.be.equal(0);
    });
  }

  @test 'should test keys'() {
    expectedDict.forEach((test) => {
      const dict = test.dictCreator();

      // tslint:disable-next-line:prefer-for-of
      for (let i = 0; i < test.keys.length; i++) {
        const key = test.keys[i];
        const value = test.values[i];

        dict.set(key, value);
      }

      expect(dict.keys.length).to.be.equal(test.keys.length);
      expect(dict.keys).to.be.deep.equal(test.keys);
    });
  }

  @test 'should test values'() {
    expectedDict.forEach((test) => {
      const dict = test.dictCreator();

      // tslint:disable-next-line:prefer-for-of
      for (let i = 0; i < test.keys.length; i++) {
        const key = test.keys[i];
        const value = test.values[i];

        dict.set(key, value);
      }

      expect(dict.values.length).to.be.equal(test.values.length);
      expect(dict.values).to.be.deep.equal(test.values);
    });
  }

  @test 'should test clear'() {
    expectedDict.forEach((test) => {
      const dict = test.dictCreator();

      // tslint:disable-next-line:prefer-for-of
      for (let i = 0; i < test.keys.length; i++) {
        const key = test.keys[i];
        const value = test.values[i];

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
class DictionaryNotSupportedTest extends UnitTest {

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