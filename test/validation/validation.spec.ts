require('reflect-metadata');
import { ValidationResult } from '../../src/model/validation/validationResult';
import { ColumnMetadata } from '../../src/model/metadata/columnMetadata';

import * as chai from 'chai';
import { expect } from 'chai';
import { suite, test } from 'mocha-typescript';

import { AssertionError } from '../../src/util';

import { LengthValidator } from '../../src/model/validation/lengthValidator';

let columnMetadata = new ColumnMetadata(null, 'name', 'string', {});


let expectedResults = [
    {
        range: {
            min: 3,
            max: 10
        },
        text: 'abc',
        columnMetadata: columnMetadata,
        result: ValidationResult.Ok
    },

    {
        range: {
            min: 3,
            max: 10
        },
        text: '',
        columnMetadata: columnMetadata,
        result: ValidationResult.create(false, 'name: Der Text \'\' muss mindestens 3 Zeichen enthalten.')
    },

    {
        range: {
            min: 3,
            max: 10
        },
        text: undefined,
        columnMetadata: columnMetadata,
        result: ValidationResult.create(false, 'name: Der Text fehlt und muss mindestens 3 Zeichen enthalten.')
    },

    {
        range: {
            min: 3,
            max: 10
        },
        text: 'a',
        columnMetadata: columnMetadata,
        result: ValidationResult.create(false, 'name: Der Text \'a\' muss mindestens 3 Zeichen enthalten.')
    },

    {
        range: {
            min: 3,
            max: 10
        },
        text: '12345678901',
        columnMetadata: columnMetadata,
        result: ValidationResult.create(false, 'name: Der Text \'12345678901\' darf höchstens 10 Zeichen enthalten.')
    },
];



@suite('Validation')
class ValidationTest {

    @test 'should validate length of string'() {
        let validator = new LengthValidator(3, 10);
        validator.attachColumnMetadata(columnMetadata);

        let res = validator.validate('ttt');
        return expect(res.ok).to.be.true;
    }


    @test 'should test LengthValidator'() {
        for (let expectedResult of expectedResults) {
            let validator = new LengthValidator(expectedResult.range.min, expectedResult.range.max);
            validator.attachColumnMetadata(expectedResult.columnMetadata);
            let res = validator.validate(expectedResult.text);
            expect(res).to.be.deep.equal(expectedResult.result);
        }
    }
}