import { PatternValidator } from './patternValidator';
import { IRangeOptions, RangeValidator } from './rangeValidator';
import { RequiredValidator } from './requiredValidator';
import { IValidation } from './validation.interface';

export class Validators {
  // from: http://stackoverflow.com/questions/46155/validate-email-address-in-javascript
  private static readonly mailPattern = '[a-z0-9!#$%&\' * +/=?^_\`{|}~-]+(?:\.[a-z0-9!#$%&\'*+/=?^_\`{|}~-]+)*@' +
  '(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?';

  /**
   * Validator für gültige Emails.
   *
   * @static
   * @type {IValidation}
   * @memberof Validators
   */
  public static email: IValidation = new PatternValidator(Validators.mailPattern, 'Invalid Email');

  /**
   * Validator für ganze Zahlen
   *
   * @static
   * @type {IValidation}
   * @memberof Validators
   */
  public static integer: IValidation = new PatternValidator('^[+-]?[0-9]+', 'Invalid number');

  /**
   * Validator für ganze positive Zahlen
   *
   * @static
   * @type {IValidation}
   * @memberof Validators
   */
  public static positiveInteger: IValidation = new PatternValidator('^[0-9]+', 'Invalid positive number');

  /**
   * Validator für Werte, die nicht optional sind.
   *
   * @static
   * @type {IValidation}
   * @memberof Validators
   */
  public static required: IValidation = new RequiredValidator();

  /**
   * Validator für einen numerischen Wertebereich
   *
   * @static
   * @param {IRangeOptions} options
   * @returns {IValidation}
   * @memberof Validators
   */
  public static range(options: IRangeOptions): IValidation {
    return new RangeValidator(options);
  }


  /**
   * Validator für Regex-Pattern
   *
   * @static
   * @param {string} pattern
   * @param {string} [info]
   * @returns {IValidation}
   * @memberof Validators
   */
  public static pattern(pattern: string, info?: string): IValidation {
    return new PatternValidator(pattern, info);
  }
}