/**
 * Information, die von Passport in der Session abgelegt ist.
 *
 * @export
 * @interface IPassport
 */
export interface IPassport {

  /**
   * Die Id des Users der aktuellen Session
   *
   * @type {number}
   * @memberof IPassport
   */
  user: number;
}