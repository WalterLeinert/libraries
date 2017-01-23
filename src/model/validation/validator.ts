import { IValidation } from './validation.interface';

export abstract class Validator implements IValidation {
    abstract validate(value: any): boolean;
}