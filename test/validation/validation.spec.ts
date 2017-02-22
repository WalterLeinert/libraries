// tslint:disable:max-classes-per-file
// tslint:disable:member-access

// require('reflect-metadata');

import { expect } from 'chai';
import { suite, test } from 'mocha-typescript';

import { ColumnMetadata } from '../../src/model/metadata/columnMetadata';
import { LengthValidator } from '../../src/model/validation/lengthValidator';
import { ValidationResult } from '../../src/model/validation/validationResult';

const columnMetadata = new ColumnMetadata(null, 'name', 'string', {});


const expectedResults = [
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
        const validator = new LengthValidator(3, 10);
        validator.attachColumnMetadata(columnMetadata);

        const res = validator.validate('ttt');
        return expect(res.ok).to.be.true;
    }


    @test 'should test LengthValidator'() {
        for (const expectedResult of expectedResults) {
            const validator = new LengthValidator(expectedResult.range.min, expectedResult.range.max);
            validator.attachColumnMetadata(expectedResult.columnMetadata);
            const res = validator.validate(expectedResult.text);
            expect(res).to.be.deep.equal(expectedResult.result);
        }
    }
}