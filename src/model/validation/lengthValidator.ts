import { ValidationResult } from './validationResult';
import { Validator } from './validator';
import { ColumnMetadata } from '../metadata/columnMetadata';

export class LengthValidator extends Validator {

    constructor(columnMetadata: ColumnMetadata, private min?: number, private max?: number) {
        super(columnMetadata);
    }

    public validate(value: number): ValidationResult {
        if ((this.min !== undefined) && length < this.min) {
            return ValidationResult.create(false, `${this.propertyName}: Der Wert ${value} muss mindestens ${this.min} sein.`);
        }

        if (this.max && length > this.max) {
            return ValidationResult.create(false, `${this.propertyName}: Der Wert ${value} darf höchstens ${this.max} sein.`);
        }

        return ValidationResult.Ok;
    }
}