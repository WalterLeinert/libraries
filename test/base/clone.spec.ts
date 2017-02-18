// tslint:disable:member-access
// tslint:disable:max-classes-per-file

import * as chai from 'chai';
import { expect } from 'chai';
import { suite, test } from 'mocha-typescript';


import { Clone } from '../../src/base/clone';

class Test {
  constructor(public id: number, private _test: boolean) {
  }

  public get test(): boolean {
    return this._test;
  }
}

class TestDerived extends Test {  
  private names: string[] = ['a', 'b', 'c'];

  constructor(public name: string, id: number, private _today: Date, test: boolean = true) {
    super(id, test);
    // ok
  }

  public get today(): Date {
    return this._today;
  }
}


@suite('Clone')
class CloneTest {

  @test 'should check TestDerived properties'() {
    const test = new TestDerived('Walter', 4711, new Date());
    expect(test.id).to.equal(4711);
    expect(test.name).to.equal('Walter');
  }


  @test 'should clone null'() {
    const test = null;
    const testCloned = Clone.clone<TestDerived>(test);
    expect(testCloned).to.deep.equal(test);
    expect(() => Clone.verifyClone(test, testCloned)).not.to.Throw();
  }

  @test 'should clone undefined'() {
    const test = null;
    const testCloned = Clone.clone<TestDerived>(test);
    expect(testCloned).to.deep.equal(test);
    expect(() => Clone.verifyClone(test, testCloned)).not.to.Throw();
  }



  @test 'should test instance identity'() {
    const test = new TestDerived('Walter', 4711, new Date());
    expect(test).to.deep.equal(test);
    expect(test).to.equal(test);
    expect(test === test).to.be.true;
  }


  @test 'should test instance equality'() {
    const test1 = new TestDerived('Walter', 4711, new Date());
    const test2 = new TestDerived('Christian', 4712, new Date());
    expect(test1).to.not.deep.equal(test2);
    expect(test1).to.not.equal(test2);
    expect(test1 === test2).to.be.not.true;
  }

 
  @test 'should clone'() {
    const test = new TestDerived('Walter', 4711, new Date());
    const testCloned = Clone.clone<TestDerived>(test);
    expect(testCloned).to.deep.equal(test);

    expect(test === testCloned).to.be.not.true;
    expect(() => Clone.verifyClone(test, testCloned)).not.to.Throw();
  }

  @test 'should verifyClone'() {
    const test = new TestDerived('Walter', 4711, new Date());    
    expect(() => Clone.verifyClone(test, test)).to.Throw();
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


@suite('Clone by clone()')
class CloneByCloneTest {

  @test 'should clone by clone function'() {
    const test = new TestWithClone(4711, false);
    const testCloned = Clone.clone(test);
    expect(testCloned).to.deep.equal(test);
    expect(() => Clone.verifyClone(test, testCloned)).not.to.Throw();
  }

}