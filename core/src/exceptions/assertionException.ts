import { Exception } from '../exceptions/exception';
import { FlxException } from './flxException.decorator';


/**
 * Modelliert einen Assertion-Error
 *
 * @export
 * @class AssertionException
 * @extends {Error}
 */
@FlxException()
export class AssertionException extends Exception {

  /**
   * Creates an instance of AssertionError.
   *
   * @param {string} [message] - optionaler Text
   *
   * @memberOf AssertionError
   */
  constructor(message?: string, innerException?: Exception) {
    super('AssertionException', message, innerException);
  }

}