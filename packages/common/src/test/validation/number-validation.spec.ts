// tslint:disable:max-classes-per-file
// tslint:disable:member-access

// require('reflect-metadata');

import { expect } from 'chai';
import { suite, test } from 'mocha-typescript';
import { RangeValidator } from '../../lib/model/validation/rangeValidator';
import { ValidationResult } from '../../lib/model/validation/validationResult';
import { CommonTest } from '../common.spec';

const rangeValidator = new RangeValidator({
  min: 3,
  max: 10
});


const expectedResults = [
  /**
   * undefined, null: ok
   */
  {
    propName: 'num',
    validator: rangeValidator,
    value: undefined,
    result: { ok: true, text: undefined }
  },

  {
    propName: 'num',
    validator: rangeValidator,
    value: null,
    result: { ok: true, text: undefined }
  },


  {
    propName: 'num',
    validator: rangeValidator,
    value: 3,
    result: { ok: true, text: undefined }
  },

  {
    propName: 'num',
    validator: rangeValidator,
    value: 10,
    result: { ok: true, text: undefined }
  },


  {
    propName: 'num',
    validator: rangeValidator,
    value: 1,
    result: { ok: false, text: `Value may not be less than ${rangeValidator.options.min}.` }
  },


  {
    propName: 'num',
    validator: rangeValidator,
    value: 11,
    result: { ok: false, text: `Value may not be greater than ${rangeValidator.options.max}.` }
  },
];



@suite('common.validation: number range')
class RangeValidationTest extends CommonTest {

  @test 'should test RangeValidator'() {
    for (const expectedResult of expectedResults) {
      const validator = expectedResult.validator;
      const expectedValidationResult = ValidationResult.create(validator, expectedResult.propName,
        expectedResult.result.ok, expectedResult.result.text);

      const res = validator.validate(expectedResult.value, expectedResult.propName);
      expect(res).to.be.deep.equal(expectedValidationResult);
    }
  }
}