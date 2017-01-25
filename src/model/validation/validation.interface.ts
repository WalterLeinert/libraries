import { ValidationResult } from './validationResult';

export interface IValidation {
    validate(value: any): ValidationResult;
}