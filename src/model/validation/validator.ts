import { ValidationResult } from './validationResult';
import { ColumnMetadata } from './../metadata/columnMetadata';
import { IValidation } from './validation.interface';

export abstract class Validator implements IValidation {
    private _columnMetadata: ColumnMetadata;

    protected constructor() {
    }

    abstract validate(value: any): ValidationResult;

    protected get columnMetadata(): ColumnMetadata {
        return this._columnMetadata;
    }

    protected get propertyName(): string {
        return this._columnMetadata.options.displayName ? this._columnMetadata.options.displayName : this._columnMetadata.propertyName;
    }

    public attachColumnMetadata(columnMetadata: ColumnMetadata) {
        this._columnMetadata = columnMetadata;
    }
}