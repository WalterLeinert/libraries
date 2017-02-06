import { StringBuilder } from '../../base';
import { Assert } from '../../util/assert';
import { ColumnMetadata } from '../metadata/columnMetadata';

import { ValidationResult } from './validationResult';
import { Validator } from './validator';


export class NotNullValidator extends Validator {

    constructor() {
        super();
    }

    public validate(value: any): ValidationResult {
        if (value === undefined || value === null) {
            return ValidationResult.create(false, '`${this.propertyName}: Wert muss angegeben werden.');
        }
        if (typeof value === 'string') {
            if (value.length <= 0) {
                return ValidationResult.create(false, '`${this.propertyName}: Text muss angegeben werden.');
            }
        }

        return ValidationResult.Ok;
    }
}