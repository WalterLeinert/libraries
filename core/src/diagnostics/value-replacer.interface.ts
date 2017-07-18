/**
 * Interface for value replacers
 *
 * @export
 * @interface IValueReplacer
 */
export interface IValueReplacer {

  /**
   * returns a value replacement for the object @param{object} and the given
   * (@param{propertyName}, @param{propertyValue}).
   *
   * Is currently used for hiding secret properties (replacing the propertyValue by undefined or '*****')
   *
   * @param {*} object - object with property propertyName
   * @param {string} propertyName - name of property
   * @param {*} propertyValue - value of property
   * @returns {*}
   * @memberof IValueReplacer
   */
  replace(object: any, propertyName: string, propertyValue: any): any;
}