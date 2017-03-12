import { Exception } from '../exceptions/exception';

/**
 * Modelliert einen Assertion-Error
 * 
 * @export
 * @class AssertionException
 * @extends {Error}
 */
export class AssertionException extends Exception {

  /**
   * Creates an instance of AssertionError.
   * 
   * @param {string} [message] - optionaler Text
   * 
   * @memberOf AssertionError
   */
  constructor(message?: string, innerException?: Exception) {
    super(message, innerException);
  }

}