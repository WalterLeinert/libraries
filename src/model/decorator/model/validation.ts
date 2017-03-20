import { MetadataStorage } from '../../metadata/metadataStorage';
import { ValidationMetadata } from '../../metadata/validationMetadata';
import { CompoundValidator } from '../../validation/compoundValidator';
import { IValidation } from '../../validation/validation.interface';


/**
 * Pattern-Decorator zur Validierung von string-Modellproperties/-attributes
 * Übergeben wird ein Array von Validatoren
 */
export function Validation(validators: IValidation[]) {
  // tslint:disable-next-line:only-arrow-functions
  return function(target: any, propertyName: string) {
    MetadataStorage.instance.addValidationMetadata(new ValidationMetadata(target.constructor, propertyName,
      new CompoundValidator(validators)));
  };
}