import { StringBuilder } from '../../base';
import { Assert } from '../../util/assert';
import { ColumnMetadata } from '../metadata/columnMetadata';

import { ValidationResult, Validator } from '.';


export class LengthValidator extends Validator {

    constructor(private min?: number, private max?: number) {
        super();
        Assert.that(max !== undefined);
    }

    public validate(value: string): ValidationResult {
        if (this.min !== undefined) {
            let error = true;
            const sb = new StringBuilder(`${this.propertyName}: Der Text`);

            if (value === undefined) {
                sb.append(' fehlt und');
            } else if (value.length < this.min) {
                sb.append(` '${value}'`);
            } else {
                error = false;
            }
            if (error) {
                sb.append(` muss mindestens ${this.min} Zeichen enthalten.`);
                return ValidationResult.create(false, sb.toString());
            }
        }

        if (this.max !== undefined) {
            let error = true;
            const sb = new StringBuilder(`${this.propertyName}: Der Text`);

            if (value === undefined) {
                sb.append(' fehlt und');
            } else if (value.length > this.max) {
                sb.append(` '${value}'`);
            } else {
                error = false;
            }
            if (error) {
                sb.append(` darf höchstens ${this.max} Zeichen enthalten.`);
                return ValidationResult.create(false, sb.toString());
            }
        }

        return ValidationResult.Ok;
    }
}