import { ValidationResult } from './validationResult';
import { Validator } from './validator';
import { IValidation } from './validation.interface';
import { ColumnMetadata } from '../metadata/columnMetadata';

export class CompoundValidator extends Validator {

    constructor(columnMetadata: ColumnMetadata, private validators: IValidation[]) {
        super(columnMetadata);
    }

    validate(value: any): ValidationResult {
        let messages = [];

        for (let v of this.validators) {
            let vr = v.validate(value);
            if (! vr.ok) {
                messages.push(vr.messages);
            }
        }

        return ValidationResult.create(messages.length <= 0, messages);
    }
}