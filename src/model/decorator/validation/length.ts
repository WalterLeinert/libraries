import { MetadataStorage } from '../../metadata/metadataStorage';
import { ValidationMetadata } from '../../metadata/validationMetadata';
import { LengthValidator } from '../../validation/lengthValidator';

// tslint:disable-next-line:unified-signatures
export function Length(min: number, max: number);
export function Length(max: number);

/**
 * Length-Decorator zur Validierung von string-Modellproperties/-attributes
 * Hier: Prüfung auf Stringlänge
 */
// tslint:disable-next-line:unified-signatures
export function Length(min?: number, max?: number) {
    // tslint:disable-next-line:only-arrow-functions
    return function(target: any, propertyName: string) {
        MetadataStorage.instance.addValidationMetadata(new ValidationMetadata(target.constructor, propertyName,
            new LengthValidator(min, max)));
    };
}