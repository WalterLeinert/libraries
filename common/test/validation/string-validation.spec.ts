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
    propName: 'name',
    range: {
      min: 3,
      max: 10
    },
    text: undefined,
    result: ValidationResult.Ok
  },

  {
    propName: 'name',
    range: {
      min: 3,
      max: 10
    },
    text: null,
    result: ValidationResult.Ok
  },


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
    text: '1234567890',
    result: ValidationResult.Ok
  },


  {
    propName: 'name',
    range: {
      min: 3,
      max: 10
    },
    text: '',
    result: ValidationResult.create(false, 'name: Text \'\' may not contain less than 3 characters.')
  },


  {
    propName: 'name',
    range: {
      min: 3,
      max: 10
    },
    text: 'a',
    result: ValidationResult.create(false, 'name: Text \'a\' may not contain less than 3 characters.')
  },

  {
    propName: 'name',
    range: {
      min: 3,
      max: 10
    },
    text: '12345678901',
    result: ValidationResult.create(false, 'name: Text \'12345678901\' may not contain more than 10 characters.')
  },
];



@suite('common.validation: string range')
class RangeValidationTest extends CommonTest {

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