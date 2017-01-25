import { Validator } from './validator';

export class LengthValidator extends Validator {

    constructor(private min: number, private max: number) {
        super();
    }

    public validate(value: number): boolean {
        if (length < this.min) {
            return false;
        }

        if (this.max && length > this.max) {
            return false;
        }

        return true;
    }
}