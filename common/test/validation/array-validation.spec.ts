// tslint:disable:max-classes-per-file
// tslint:disable:member-access

// require('reflect-metadata');

import { expect } from 'chai';
import { suite, test } from 'mocha-typescript';
import { RangeValidator } from '../../src/model/validation/rangeValidator';
import { ValidationResult } from '../../src/model/validation/validationResult';
import { Validators } from '../../src/model/validation/validators';
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
    propName: 'array',
    validator: rangeValidator,
    value: undefined,
    result: { ok: true, text: undefined }
  },

  {
    propName: 'array',
    validator: rangeValidator,
    value: null,
    result: { ok: true, text: undefined }
  },


  {
    propName: 'array',
    validator: rangeValidator,
    value: [1, 2, 3],
    result: { ok: true, text: undefined }
  },

  {
    propName: 'array',
    validator: rangeValidator,
    value: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
    result: { ok: true, text: undefined }
  },


  {
    propName: 'array',
    validator: rangeValidator,
    value: [1],
    result: { ok: false, text: 'array: Array [1] may not contain less than 3 elements.' }
  },


  {
    propName: 'array',
    validator: rangeValidator,
    value: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11],
    result: { ok: false, text: 'array: Array [11] may not contain more than 10 elements.' }
  },
];



@suite('common.validation: array range')
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