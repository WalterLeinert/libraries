import { ICookie } from './cookie.interface';
import { IPassport } from './passport.interface';
import { ISession } from './session.interface';

/**
 * Modelliert eine ts-expresss-decorators Session
 *
 * @export
 * @class ExpressSession
 */
export class ExpressSession implements ISession {

  /**
   * Cookie Information
   *
   * @type {ICookie}
   * @memberof Session
   */
  public cookie: ICookie;

  /**
   * Passport Information
   *
   * @type {IPassport}
   * @memberof Session
   */
  public passport: IPassport;
}