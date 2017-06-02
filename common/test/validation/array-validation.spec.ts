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
    propName: 'array',
    range: {
      min: 3,
      max: 10
    },
    value: undefined,
    result: ValidationResult.Ok
  },

  {
    propName: 'array',
    range: {
      min: 3,
      max: 10
    },
    value: null,
    result: ValidationResult.Ok
  },


  {
    propName: 'array',
    range: {
      min: 3,
      max: 10
    },
    value: [1, 2, 3],
    result: ValidationResult.Ok
  },

  {
    propName: 'array',
    range: {
      min: 3,
      max: 10
    },
    value: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
    result: ValidationResult.Ok
  },


  {
    propName: 'array',
    range: {
      min: 3,
      max: 10
    },
    value: [1],
    result: ValidationResult.create(false, 'array: Array [1] may not contain less than 3 elements.')
  },


  {
    propName: 'array',
    range: {
      min: 3,
      max: 10
    },
    value: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11],
    result: ValidationResult.create(false, 'array: Array [11] may not contain more than 10 elements.')
  },
];



@suite('common.validation: array range')
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