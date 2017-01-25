import { MetadataStorage } from '../../metadata/metadataStorage';
import { LengthValidator } from '../../validation/lengthValidator';
import { ValidationMetadata } from '../../metadata/validationMetadata';

/**
 * Length-Decorator zur Validierung von Modellproperties/-attributes
 * 
 */
export function NotNull() {
        return function (target: any, propertyName: string) {

        let metadata = MetadataStorage.instance.findTableMetadata(target);
        let cm = metadata.getColumnMetadataByProperty(propertyName);

        MetadataStorage.instance.addValidationMetadata(new ValidationMetadata(target.constructor, propertyName, this));
    };
}