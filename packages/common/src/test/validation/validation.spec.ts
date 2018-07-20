// tslint:disable:max-classes-per-file
// tslint:disable:member-access
// tslint:disable:no-unused-expression

// require('reflect-metadata');

import { expect } from 'chai';
import { suite, test } from 'mocha-typescript';
import { Validators } from '../../lib/model/validation/validators';
import { CommonTest } from '../common.spec';



@suite('common.validation')
class ValidationTest extends CommonTest {

  @test 'should validate email addresses'() {
    const validator = Validators.email;

    let res = validator.validate(undefined, 'mail');
    expect(res.ok).to.be.true;

    res = validator.validate(null, 'mail');
    expect(res.ok).to.be.true;


    res = validator.validate('walter.leinert@outlook.com', 'mail');
    expect(res.ok).to.be.true;

    res = validator.validate('hallo', 'mail');
    expect(res.ok).to.be.false;
  }

  @test 'should validate numbers'() {
    const validator = Validators.integer;

    let res = validator.validate(undefined, 'num');
    expect(res.ok).to.be.true;

    res = validator.validate(null, 'num');
    expect(res.ok).to.be.true;


    res = validator.validate('12345', 'num');
    expect(res.ok).to.be.true;

    res = validator.validate('+12345', 'num');
    expect(res.ok).to.be.true;

    res = validator.validate('-12345', 'num');
    expect(res.ok).to.be.true;

    res = validator.validate('xy', 'num');
    return expect(res.ok).to.be.false;
  }


  @test 'should validate positive numbers'() {
    const validator = Validators.positiveInteger;

    let res = validator.validate(undefined, 'num');
    expect(res.ok).to.be.true;

    res = validator.validate(null, 'num');
    expect(res.ok).to.be.true;

    res = validator.validate('12345', 'num');
    expect(res.ok).to.be.true;

    res = validator.validate('-12345', 'num');
    expect(res.ok).to.be.false;

    res = validator.validate('xy', 'num');
    return expect(res.ok).to.be.false;
  }
}