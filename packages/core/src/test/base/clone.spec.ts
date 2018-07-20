// tslint:disable:member-access
// tslint:disable:max-classes-per-file
// tslint:disable:no-unused-expression

import { expect } from 'chai';
import { suite, test } from 'mocha-typescript';


import { Clone } from '../../lib/base/clone';
import { CloneVerifier } from '../../lib/base/clone-verifier';
import { UniqueIdentifiable } from '../../lib/base/uniqueIdentifiable';
import { Types } from '../../lib/types/types';
import { CoreUnitTest } from '../unit-test';


class Test extends UniqueIdentifiable {
  // tslint:disable-next-line:no-unused-variable
  private valueNumber = 4711;
  // tslint:disable-next-line:no-unused-variable
  private valueString = 'Walter';
  // tslint:disable-next-line:no-unused-variable
  private valueBoolean = true;
  // tslint:disable-next-line:no-unused-variable
  private valueSymbol = Symbol(12);


  constructor(public id: number, private _testFlag: boolean) {
    super();
  }

  public get testFlag(): boolean {
    return this._testFlag;
  }

  // tslint:disable-next-line:no-unused-variable
  private func() {
    // ok
  }
}


class TestDerived extends Test {
  // tslint:disable-next-line:no-unused-variable
  private names: string[] = ['a', 'b', 'c'];

  constructor(public name: string, id: number, private _today: Date, dotest: boolean = true) {
    super(id, dotest);
    // ok
  }

  public get today(): Date {
    return this._today;
  }
}


const primitiveTests = [
  {
    type: 'number',
    value: 4711
  },
  {
    type: 'string',
    value: 'Hallo'
  },
  {
    type: 'boolean',
    value: false
  },
  {
    type: 'symbol',
    value: Symbol(123)
  },
  {
    type: 'undefined',
    value: undefined
  }
];


@suite('core.base.Clone primitives')
class ClonePrimitivesTest extends CoreUnitTest {

  @test 'should clone all primitives'() {
    primitiveTests.forEach((primitiveTest) => {
      const value = primitiveTest.value;

      expect(Types.isPrimitive(value)).to.be.true;
      expect(typeof value).to.equal(primitiveTest.type);

      const testCloned = Clone.clone(value);
      expect(testCloned).to.deep.equal(value);
      expect(() => CloneVerifier.verifyClone(value, testCloned)).not.to.Throw();
    });

  }
}


@suite('core.base.Clone')
class CloneTest extends CoreUnitTest {

  @test 'should check TestDerived properties'() {
    const value = new TestDerived('Walter', 4711, new Date());
    expect(value.id).to.equal(4711);
    expect(value.name).to.equal('Walter');
  }


  @test 'should clone null'() {
    const value = null;
    const testCloned = Clone.clone<TestDerived>(value);
    expect(testCloned).to.deep.equal(value);
    expect(() => CloneVerifier.verifyClone(value, testCloned)).not.to.Throw();
  }

  @test 'should clone undefined'() {
    const value = null;
    const testCloned = Clone.clone<TestDerived>(value);
    expect(testCloned).to.deep.equal(value);
    expect(() => CloneVerifier.verifyClone(value, testCloned)).not.to.Throw();
  }



  @test 'should test instance identity'() {
    const value = new TestDerived('Walter', 4711, new Date());
    expect(value).to.deep.equal(value);
    expect(value).to.equal(value);
    expect(value === value).to.be.true;
  }


  @test 'should test instance equality'() {
    const test1 = new TestDerived('Walter', 4711, new Date());
    const test2 = new TestDerived('Christian', 4712, new Date());
    expect(test1).to.not.deep.equal(test2);
    expect(test1).to.not.equal(test2);
    expect(test1 === test2).to.be.not.true;
  }


  @test 'should clone'() {
    const value = new TestDerived('Walter', 4711, new Date());
    const testCloned = Clone.clone<TestDerived>(value);

    // Test so nicht möglich, da sich die Instanzen in der instanceId unterscheiden (UniqueIdentifiable)!
    // expect(testCloned).to.deep.equal(test);

    expect(value === testCloned).to.be.not.true;
    expect(() => CloneVerifier.verifyClone(value, testCloned)).not.to.Throw();
  }

  @test 'should verifyClone'() {
    const value = new TestDerived('Walter', 4711, new Date());
    expect(() => CloneVerifier.verifyClone(value, value)).to.Throw();
  }

}


class TestWithClone {
  constructor(public id: number, private _test: boolean) {
  }

  public get test(): boolean {
    return this._test;
  }

  public clone(): TestWithClone {
    return new TestWithClone(this.id, this._test);
  }
}


@suite('core.base.Clone by clone()')
class CloneByCloneTest extends CoreUnitTest {

  @test 'should clone'() {
    const value = new TestWithClone(4711, false);
    const valueCloned = Clone.clone(value);
    expect(valueCloned).to.deep.equal(value);

    // TestWithClone ist kein UniqueIdentifiable -> es darf nicht auf Zyklen getestet werden,
    // da sonst Error in Dictionary
    expect(() => CloneVerifier.verifyClone(value, valueCloned, false)).not.to.Throw();
  }

}