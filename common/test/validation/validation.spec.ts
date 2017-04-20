// tslint:disable:max-classes-per-file
// tslint:disable:member-access

// require('reflect-metadata');

import { expect } from 'chai';
import { suite, test } from 'mocha-typescript';
import { ValidationResult } from '../../src/model/validation/validationResult';
import { Validators } from '../../src/model/validation/validators';
import { CommonTest } from '../common.spec';

const expectedResults = [
  {
    propName: 'name',
    range: {
      min: 3,
      max: 10
    },
    text: 'abc',
    result: ValidationResult.Ok
  },

  {
    propName: 'name',
    range: {
      min: 3,
      max: 10
    },
    text: '',
    result: ValidationResult.create(false, 'name: Text \'\' must contain at least 3 characters.')
  },

  {
    propName: 'name',
    range: {
      min: 3,
      max: 10
    },
    text: undefined,
    result: ValidationResult.create(false, 'name: Text is missing and must contain at least 3 characters.')
  },

  {
    propName: 'name',
    range: {
      min: 3,
      max: 10
    },
    text: 'a',
    result: ValidationResult.create(false, 'name: Text \'a\' must contain at least 3 characters.')
  },

  {
    propName: 'name',
    range: {
      min: 3,
      max: 10
    },
    text: '12345678901',
    result: ValidationResult.create(false, 'name: Text \'12345678901\' may contain not more than 10 characters.')
  },
];



@suite('Validation')
class ValidationTest extends CommonTest {

  @test 'should validate email addresses'() {
    const validator = Validators.email;
    const res = validator.validate('walter.leinert@outlook.com', 'mail');
    expect(res.ok).to.be.true;

    const res1 = validator.validate('hallo', 'mail');
    expect(res1.ok).to.be.false;
  }

  @test 'should validate numbers'() {
    const validator = Validators.integer;
    const res = validator.validate('12345', 'name');
    expect(res.ok).to.be.true;

    const res1 = validator.validate('xy', 'name');
    return expect(res1.ok).to.be.false;
  }

  @test 'should validate length of string'() {
    const validator = Validators.range({ min: 3, max: 10 });
    const res = validator.validate('ttt', 'name');
    return expect(res.ok).to.be.true;
  }


  @test 'should test RangeValidator'() {
    for (const expectedResult of expectedResults) {
      const validator = Validators.range({
        min: expectedResult.range.min,
        max: expectedResult.range.max
      });

      const res = validator.validate(expectedResult.text, expectedResult.propName);
      expect(res).to.be.deep.equal(expectedResult.result);
    }
  }
}