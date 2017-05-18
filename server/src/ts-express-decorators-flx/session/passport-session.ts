import { ICookie } from './cookie.interface';
import { IPassport } from './passport.interface';
import { ISession } from './session.interface';


/**
 * Modelliert eine dummy ts-expresss-decorators Sessionfür die Integration
 * mit Passport
 *
 * @export
 * @class PassportSession
 */
export class PassportSession implements ISession {

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


  constructor(userId: number, public clientId: number) {
    this.cookie = {
      httpOnly: undefined,
      maxAge: undefined,
      path: undefined,
      secure: undefined
    };

    this.passport = {
      user: userId
    };

  }
}