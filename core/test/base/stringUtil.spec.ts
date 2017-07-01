// tslint:disable:member-access

import { expect } from 'chai';
import { suite, test } from 'mocha-typescript';


import { StringUtil } from '../../src/base/stringUtil';
import { AssertionException } from '../../src/exceptions/assertionException';
import { UnitTest } from '../../src/testing/unit-test';


@suite('core.base.StringUtil')
class StringUtilTest extends UnitTest {


  @test 'should insert Text at 0'() {
    const text = 'Hallo';
    return expect(StringUtil.splice(text, 0, 0, '#')).to.be.equal('#Hallo');
  }

  @test 'should append Text'() {
    const text = 'Hallo';
    return expect(StringUtil.splice(text, text.length, 0, '#')).to.be.equal('Hallo#');
  }

  @test 'should insert Text at 1'() {
    const text = 'Hallo';
    return expect(StringUtil.splice(text, 1, 0, '#')).to.be.equal('H#allo');
  }


  @test 'should insert Text at 0 (remove 2)'() {
    const text = 'Hallo';
    return expect(StringUtil.splice(text, 0, 2, '#')).to.be.equal('#llo');
  }

  @test 'should insert Text at 0 (remove 4)'() {
    const text = 'Hallo';
    return expect(StringUtil.splice(text, 1, 4, '#')).to.be.equal('H#');
  }

  @test 'should insert no Text at 1 (remove none)'() {
    const text = 'Hallo';
    return expect(StringUtil.splice(text, 1, 0)).to.be.equal('Hallo');
  }

  @test 'should remove Text at 1 (remove 2)'() {
    const text = 'Hallo';
    return expect(StringUtil.splice(text, 1, 2)).to.be.equal('Hlo');
  }


  /**
   * Expected Errors
   */
  @test 'should throw Error (text)'() {
    const text = undefined;
    return expect(() => StringUtil.splice(text, 0, 2, '#')).to.throw(AssertionException);
  }

  @test 'should throw Error (start: -1)'() {
    const text = 'Hallo';
    return expect(() => StringUtil.splice(text, -1, 2, '#')).to.throw(AssertionException);
  }

  @test 'should throw Error (start: text.length+1)'() {
    const text = 'Hallo';
    return expect(() => StringUtil.splice(text, text.length + 1, 2, '#')).to.throw(AssertionException);
  }


  @test 'should throw Error (delCount: -1)'() {
    const text = 'Hallo';
    return expect(() => StringUtil.splice(text, 0, -1, '#')).to.throw(AssertionException);
  }

  @test 'should throw Error (delCount: text.length+1)'() {
    const text = 'Hallo';
    return expect(() => StringUtil.splice(text, 0, text.length + 1, '#')).to.throw(AssertionException);
  }

  @test 'should throw Error (start + delCount: text.length+1)'() {
    const text = 'Hallo';
    return expect(() => StringUtil.splice(text, 2, 5, '#')).to.throw(AssertionException);
  }

}