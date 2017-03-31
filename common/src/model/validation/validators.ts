import { PatternValidator } from './patternValidator';
import { IRangeOptions, RangeValidator } from './rangeValidator';
import { RequiredValidator } from './requiredValidator';
import { IValidation } from './validation.interface';

export class Validators {
  // from: http://stackoverflow.com/questions/46155/validate-email-address-in-javascript
  private static readonly mailPattern = '[a-z0-9!#$%&\' * +/=?^_\`{|}~-]+(?:\.[a-z0-9!#$%&\'*+/=?^_\`{|}~-]+)*@' +
  '(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?';

  public static email: IValidation = new PatternValidator(Validators.mailPattern, 'Invalid Email');
  public static integer: IValidation = new PatternValidator('[+-]?[0-9]+', 'Invalid numnber');

  public static required: IValidation = new RequiredValidator();

  public static range(options: IRangeOptions): IValidation {
    return new RangeValidator(options);
  }

  public static pattern(pattern: string, info?: string): IValidation {
    return new PatternValidator(pattern, info);
  }
}