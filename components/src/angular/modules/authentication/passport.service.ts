// Angular
import { Injectable } from '@angular/core';
import { Http, Response } from '@angular/http';

import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/do';
import 'rxjs/add/operator/map';
import { Observable } from 'rxjs/Observable';

// -------------------------- logging -------------------------------
// tslint:disable-next-line:no-unused-variable
import { getLogger, ILogger, levels, using, XLog } from '@fluxgate/platform';
// -------------------------- logging -------------------------------

// Fluxgate
import {
  AppConfigService, ServiceCore
} from '@fluxgate/client';
import { IUser, PasswordChange, User } from '@fluxgate/common';
import { Assert, Core } from '@fluxgate/core';


@Injectable()
export class PassportService extends ServiceCore {
  protected static logger = getLogger(PassportService);

  public static get LOGIN() { return '/login'; }
  public static get SIGNUP() { return '/signup'; }
  public static get LOGOFF() { return '/logout'; }
  public static get CHANGE_PASSWORD() { return '/changePassword'; }
  public static get CURRENT_USER() { return '/currentUser'; }


  /**
   * Creates an instance of PassportService.
   *
   * @param {Http} http
   * @param {AppConfigService} configService
   * @param {string} _topic - das Topic des Service
   *
   * @memberOf PassportService
   */
  constructor(http: Http, configService: AppConfigService) {
    super(http, configService.config.url, 'passport');

    using(new XLog(PassportService.logger, levels.INFO, 'ctor'), (log) => {
      // ok
    });
  }


  /**
   * Meldet den Benutzer mit Benutzernamen {username} beim System an.
   *
   * @param {string} username
   * @param {string} password
   *
   * @memberOf PassportService
   */
  public login(username: string, password: string, clientId: number): Observable<IUser> {
    Assert.notNullOrEmpty(username, 'username');
    Assert.notNullOrEmpty(password, 'password');
    return using(new XLog(PassportService.logger, levels.INFO, 'login', `username =  ${username}`), (log) => {

      const user = new User();
      user.username = username;
      user.password = password;
      user.__client = clientId;

      return this.http.post(this.getUrl() + PassportService.LOGIN, this.serialize(user))
        .map((response: Response) => this.deserialize(response.json()))
        .do((u) => {
          log.log('user: ' + Core.stringify(u));
        })
        .catch(this.handleError);
    });
  }


  /**
   * Registriert einen neuen Benutzer im System
   *
   * @param {User} user
   * @returns {Observable<User>}
   *
   * @memberOf PassportService
   */
  public signup(user: User): Observable<User> {
    Assert.notNull(user, 'user');
    return using(new XLog(PassportService.logger, levels.INFO, 'signup',
      `username =  ${Core.stringify(user)}`), (log) => {
        return this.http.post(this.getUrl() + PassportService.SIGNUP, this.serialize(user))
          .map((response: Response) => this.deserialize(response.json()))
          .do((u) => {
            log.log(`user = ${Core.stringify(u)}`);
          })
          .catch(this.handleError);
      });
  }


  /**
   * Meldet den aktuellen Benutzer ab
   *
   * @returns {Observable<any>}
   *
   * @memberOf PassportService
   */
  public logoff() {
    return using(new XLog(PassportService.logger, levels.INFO, 'logoff'), (log) => {
      return this.http.get(this.getUrl() + PassportService.LOGOFF)
        .map((response: Response) => {
          // ok
        }).do((user) => {
          log.log(`user = ${Core.stringify(user)}`);
        })
        .do((data) => PassportService.logger.info('result: ' + Core.stringify(data)))
        .catch(this.handleError);
    });
  }


  /**
   * Ändert das Passwort des aktuellen Benutzers.
   *
   * @param {string} username - aktueller Username
   * @param {string} password - aktuelles Passwort
   * @param {string} passwordNew - neues Passwort
   *
   * @memberOf PassportService
   */
  public changePassword(username: string, password: string, passwordNew: string): Observable<IUser> {
    Assert.notNullOrEmpty(password, 'password');
    Assert.notNullOrEmpty(passwordNew, 'passwordNew');
    return using(new XLog(PassportService.logger, levels.INFO, 'changePassword', `username = ${username}`), (log) => {
      const passwordChange = new PasswordChange(username, password, passwordNew);

      return this.http.post(this.getUrl() + PassportService.CHANGE_PASSWORD, this.serialize(passwordChange))
        .map((response: Response) => this.deserialize(response.json()))
        .do((user) => {
          log.log(`user = ${Core.stringify(user)}`);
        })
        .catch(this.handleError);
    });
  }

}