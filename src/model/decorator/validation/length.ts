import { MetadataStorage } from '../../metadata/metadataStorage';
import { LengthValidator } from '../../validation/lengthValidator';
import { ValidationMetadata } from '../../metadata/validationMetadata';

export function Length(min: number, max: number);
export function Length(max: number);

/**
 * Length-Decorator zur Validierung von string-Modellproperties/-attributes
 * Hier: Prüfung auf Stringlänge
 */
export function Length(min?: number, max?: number) {
        return function (target: any, propertyName: string) {
        MetadataStorage.instance.addValidationMetadata(new ValidationMetadata(target.constructor, propertyName, 
            new LengthValidator(min, max)));
    };
}