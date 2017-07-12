// tslint:disable:max-classes-per-file
// tslint:disable:member-access
// tslint:disable:no-unused-expression

import { expect } from 'chai';
import { suite, test } from 'mocha-typescript';

import { UniqueIdentifiable } from '../../src/base/uniqueIdentifiable';
import { Dictionary } from '../../src/types/dictionary';
import { CoreUnitTest } from '../unit-test';

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


@suite('core.types.Dictionary: Dictionary<KeyClass, ValueClass>, type checks')
class IdentifiableTest extends CoreUnitTest {

  @test 'should set an item of wrong type -> exception'() {
    const d = new Dictionary<KeyClass, ValueClass>();

    const key = new KeyClass(1);
    const value = new ValueClass('aaa');
    expect(() => d.set(key, value)).not.to.Throw();
    expect(() => d.set('aaa' as any as KeyClass, value)).to.Throw();
  }


  @test 'should remove an item of wrong type -> exception'() {
    const d = new Dictionary<KeyClass, ValueClass>();

    const key = new KeyClass(1);
    const value = new ValueClass('aaa');
    expect(() => d.set(key, value)).not.to.Throw();
    expect(() => d.remove('aaa' as any as KeyClass)).to.Throw();
  }


  @test 'should test an item of wrong type -> exception'() {
    const d = new Dictionary<KeyClass, ValueClass>();

    const key = new KeyClass(1);
    const value = new ValueClass('aaa');
    expect(() => d.set(key, value)).not.to.Throw();
    expect(() => d.containsKey('aaa' as any as KeyClass)).to.Throw();
  }


}