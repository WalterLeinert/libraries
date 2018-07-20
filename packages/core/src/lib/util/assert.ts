import { AssertionException } from '../exceptions/assertionException';

/**
 * Runtime Assertions v.a. für Programmierfehler (fail hard and early)
 *
 * @export
 * @class Assert
 */
export class Assert {
  public static ok(condition: boolean, message?: string) {
    if (!condition) {
      throw new AssertionException('condition not met' + (message ? ': ' + message : ''));
    }
  }

  /**
   * Stellt sicher, dass @param{condition} erfüllt ist.
   * Wirft einen @see{AssertionError} falls nicht.
   *
   * @static
   * @param {boolean} condition
   * @param {string} [message]
   *
   * @memberOf Assert
   */
  public static that(condition: boolean, message?: string) {
    if (!condition) {
      throw new AssertionException('condition not met' + (message ? ': ' + message : ''));
    }
  }


  /**
   * Stellt sicher, dass die Werte vom Typ {T} @param{value1} und @param{value2} gleich sind.
   * Wirft einen @see{AssertionError} falls nicht.
   *
   * @static
   * @param {boolean} condition
   * @param {string} [message]
   *
   * @memberOf Assert
   */
  public static equal<T>(value1: T, value2: T, message?: string) {
    if (value1 !== value2) {
      throw new AssertionException(`value1 ${value1} not equal ${value1}` + (message ? ': ' + message : ''));
    }
  }


  /**
   * Stellt sicher, dass der Wert vom Typ {T} @param{value} nicht null oder undefined ist.
   * Wirft einen @see{AssertionError} falls nicht.
   *
   * @static
   * @param {boolean} condition
   * @param {string} [message]
   *
   * @memberOf Assert
   */
  public static notNull<T>(value: T, message?: string) {
    if (value === null) {
      throw new AssertionException('value is null' + (message ? ': ' + message : ''));
    }
    if (value === undefined) {
      throw new AssertionException('value is undefined' + (message ? ': ' + message : ''));
    }
  }

  /**
   * Stellt sicher, dass @param{subject} nicht null oder leer ist.
   * Wirft einen @see{AssertionError} falls nicht.
   *
   * @static
   * @param {(string | any[])} subject
   * @param {string} [message]
   *
   * @memberOf Assert
   */
  public static notNullOrEmpty(subject: string | any[], message?: string) {
    Assert.notNull(subject, 'subject');

    if (subject.length <= 0) {
      throw new AssertionException('subject is empty' + (message ? ': ' + message : ''));
    }
  }
}