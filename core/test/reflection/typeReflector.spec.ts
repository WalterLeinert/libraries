// tslint:disable:max-classes-per-file
// tslint:disable:member-access

// tslint:disable-next-line:no-var-requires
require('reflect-metadata');


import { expect } from 'chai';
import { suite, test } from 'mocha-typescript';

import { TypeReflector } from '../../src/reflection/typeReflector';
import { CoreUnitTest } from '../../src/testing/unit-test';

class BaseClass {
  constructor(public name: string) {
  }
}

class DerivedClass extends BaseClass {
  constructor(name: string, private id: number) {
    super(name);
  }
}


@suite('core.reflection.TypeReflector')
class ReflectionTest extends CoreUnitTest {

  @test 'should create instance of TypeReflector'() {
    const tr = new TypeReflector(BaseClass);
    return expect(tr).to.be.not.null;
  }
}