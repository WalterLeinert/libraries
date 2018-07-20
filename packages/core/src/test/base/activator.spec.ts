// tslint:disable:max-classes-per-file
// tslint:disable:member-access

import { expect } from 'chai';
import { suite, test } from 'mocha-typescript';

import { Activator } from '../../lib/base/activator';
import { CoreUnitTest } from '../unit-test';

class Test {
  constructor(public name: string, public id: number) {
  }
}


class Test2 {
  constructor() {
    // ok
  }
}

@suite('core.base.Activator')
class ActivatorTest extends CoreUnitTest {

  @test 'should create instance of class Test'() {
    const expectedTest = new Test('hugo', 4711);
    return expect(Activator.createInstance<Test>(Test, expectedTest.name, expectedTest.id)).to.be.eql(expectedTest);
  }


  @test 'should create instance of class Test: 2nd parameter missing'() {
    const expectedTest = new Test('hugo', undefined);
    return expect(Activator.createInstance<Test>(Test, expectedTest.name)).to.be.eql(expectedTest);
  }

  @test 'should create instance of class Test: all parameters missing'() {
    const expectedTest = new Test(undefined, undefined);
    return expect(Activator.createInstance<Test>(Test)).to.be.eql(expectedTest);
  }

  @test 'should create instance of class Test2'() {
    return expect(Activator.createInstance<Test2>(Test2)).to.be.not.null;
  }
}