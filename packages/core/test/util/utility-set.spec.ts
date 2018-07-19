// tslint:disable:max-classes-per-file
// tslint:disable:member-access
// tslint:disable:no-unused-expression


import { expect } from 'chai';
import { suite, test } from 'mocha-typescript';

import { Utility } from '../../src/util/utility';
import { CoreUnitTest } from '../unit-test';


@suite('core.util.utility - set operations')
class UtilityTest extends CoreUnitTest {


  @test 'should test toArray'() {
    expect(Utility.toArray(new Set([1, 2]))).to.deep.equal([1, 2]);
  }


  @test 'should test union'() {
    const result = Utility.union(new Set([1, 2]), new Set([3, 4]));
    expect(result.size).to.equal(4);
    expect(Utility.toArray(result)).to.deep.equal([1, 2, 3, 4]);
  }


  @test 'should test intersection'() {
    const result = Utility.intersect(new Set([1, 2, 3]), new Set([4, 3, 2]));
    expect(result.size).to.equal(2);
    expect(Utility.toArray(result)).to.deep.equal([2, 3]);
  }


  @test 'should test difference'() {
    const result = Utility.difference(new Set([1, 2, 3]), new Set([4, 3, 2]));
    expect(result.size).to.equal(1);
    expect(Utility.toArray(result)).to.deep.equal([1]);
  }

  @test 'should test difference 2'() {
    const result = Utility.difference(new Set([4, 3, 2]), new Set([1, 2, 3]));
    expect(result.size).to.equal(1);
    expect(Utility.toArray(result)).to.deep.equal([4]);
  }


}