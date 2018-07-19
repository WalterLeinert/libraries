import { ICookie } from './cookie.interface';
import { IPassport } from './passport.interface';


/**
 * Session Informationen
 *
 * @export
 * @interface ICookie
 */
export interface ISession {

  /**
   * Cookie Information
   *
   * @type {ICookie}
   * @memberof Session
   */
  cookie: ICookie;

  /**
   * Passport Information
   *
   * @type {IPassport}
   * @memberof Session
   */
  passport: IPassport;

}