// tslint:disable:max-classes-per-file
// tslint:disable:member-access

// require('reflect-metadata');

import { expect } from 'chai';
import { suite, test } from 'mocha-typescript';
import { ValidationResult } from '../../src/model/validation/validationResult';
import { Validators } from '../../src/model/validation/validators';
import { CommonTest } from '../common.spec';

const expectedResults = [
  /**
   * undefined, null: ok
   */
  {
    propName: 'num',
    range: {
      min: 3,
      max: 10
    },
    value: undefined,
    result: ValidationResult.Ok
  },

  {
    propName: 'num',
    range: {
      min: 3,
      max: 10
    },
    value: null,
    result: ValidationResult.Ok
  },


  {
    propName: 'num',
    range: {
      min: 3,
      max: 10
    },
    value: 3,
    result: ValidationResult.Ok
  },

  {
    propName: 'num',
    range: {
      min: 3,
      max: 10
    },
    value: 10,
    result: ValidationResult.Ok
  },


  {
    propName: 'num',
    range: {
      min: 3,
      max: 10
    },
    value: 1,
    result: ValidationResult.create(false, 'num: 1 may not be less than 3.')
  },


  {
    propName: 'num',
    range: {
      min: 3,
      max: 10
    },
    value: 11,
    result: ValidationResult.create(false, 'num: 11 may not be greater than 10.')
  },
];



@suite('common.validation: number range')
class RangeValidationTest extends CommonTest {

  @test 'should test RangeValidator'() {
    for (const expectedResult of expectedResults) {
      const validator = Validators.range({
        min: expectedResult.range.min,
        max: expectedResult.range.max
      });

      const res = validator.validate(expectedResult.value, expectedResult.propName);
      expect(res).to.be.deep.equal(expectedResult.result);
    }
  }
}