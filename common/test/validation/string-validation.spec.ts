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
    propName: 'name',
    validator: rangeValidator,
    value: undefined,
    result: { ok: true, text: undefined }
  },

  {
    propName: 'name',
    validator: rangeValidator,
    value: null,
    result: { ok: true, text: undefined }
  },


  {
    propName: 'name',
    validator: rangeValidator,
    value: 'abc',
    result: { ok: true, text: undefined }
  },

  {
    propName: 'name',
    validator: rangeValidator,
    value: '1234567890',
    result: { ok: true, text: undefined }
  },


  {
    propName: 'name',
    validator: rangeValidator,
    value: '',
    result: { ok: false, text: 'Text \'\' may not contain less than 3 characters.' }
  },


  {
    propName: 'name',
    validator: rangeValidator,
    value: 'a',
    result: { ok: false, text: 'Text \'a\' may not contain less than 3 characters.' }
  },

  {
    propName: 'name',
    validator: rangeValidator,
    value: '12345678901',
    result: { ok: false, text: 'Text \'12345678901\' may not contain more than 10 characters.' }
  },
];



@suite('common.validation: string range')
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