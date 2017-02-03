import { MetadataStorage } from '../../metadata/metadataStorage';
import { ValidationMetadata } from '../../metadata/validationMetadata';
import { LengthValidator } from '../../validation/lengthValidator';
import { NotNullValidator } from '../../validation/notNullValidator';

/**
 * NotNull-Decorator zur Validierung von Modellproperties/-attributes
 * Hier: Prüfung auf fehlenden Wert
 * 
 */
export function NotNull() {
    // tslint:disable-next-line:only-arrow-functions
    return function(target: any, propertyName: string) {
        MetadataStorage.instance.addValidationMetadata(
            new ValidationMetadata(target.constructor, propertyName, new NotNullValidator()));
    };
}