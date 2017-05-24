import { MetadataStorage } from '../metadata/metadataStorage';
import { ValidationMetadata } from '../metadata/validationMetadata';
import { CompoundValidator } from '../validation/compoundValidator';
import { IValidation } from '../validation/validation.interface';


/**
 * Decorator: definiert ein Array von Validatoren, welches auf einen CompoudValidator abgebildet wird.
 * Die Validierunginformation wird in den Metadaten abgelegt und kann im Client und Server ausgewerte werden.
 */
export function Validation(validators: IValidation[]) {
  // tslint:disable-next-line:only-arrow-functions
  return function (target: Object, propertyName: string) {
    MetadataStorage.instance.addValidationMetadata(new ValidationMetadata(target.constructor, propertyName,
      new CompoundValidator(validators)));
  };
}