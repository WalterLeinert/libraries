// tslint:disable:max-classes-per-file
// tslint:disable:member-access


import { expect } from 'chai';
import { suite, test } from 'mocha-typescript';

import { Utility } from '../../src/util/utility';


class Test {
  id: number;
}

const testData = [ new Test() ];
const numberData: number[] = [1, 2, 3];
const stringData: string[] = ['a', 'b', 'c'];

@suite('util.utility')
class UtilityTest {


  @test 'should test for not null or empty (string)'() {
    expect(!Utility.isNullOrEmpty('hallo')).to.be.true;
  }

  @test 'should test for not null or empty (arrays)'() {
    expect(!Utility.isNullOrEmpty(numberData)).to.be.true;
    expect(!Utility.isNullOrEmpty(stringData)).to.be.true;
    expect(!Utility.isNullOrEmpty(testData)).to.be.true;
  }


  @test 'should test for not null or empty (null, [])'() {
    expect(Utility.isNullOrEmpty(null)).to.be.true;
    expect(Utility.isNullOrEmpty([])).to.be.true;
  }

}