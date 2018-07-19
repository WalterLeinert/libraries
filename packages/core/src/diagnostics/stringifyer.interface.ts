/**
 * Interface for stringifyers
 *
 * @export
 * @interface IStringifyer
 */
export interface IStringifyer {

  /**
   * returns the json string of @param{value}
   *
   * @param {*} value
   * @returns {string}
   * @memberof IStringifyer
   */
  stringify(value: any): string;
}