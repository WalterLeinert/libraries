import { MetadataStorage } from '../../metadata/metadataStorage';
import { NotNullValidator } from '../../validation/notNullValidator';
import { LengthValidator } from '../../validation/lengthValidator';
import { ValidationMetadata } from '../../metadata/validationMetadata';

/**
 * NotNull-Decorator zur Validierung von Modellproperties/-attributes
 * Hier: Prüfung auf fehlenden Wert
 * 
 */
export function NotNull() {
    return function (target: any, propertyName: string) {
        MetadataStorage.instance.addValidationMetadata(new ValidationMetadata(target.constructor, propertyName, new NotNullValidator()));
    };
}