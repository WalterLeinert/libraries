import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { Observable } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';

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

  public static readonly LOGIN = '/login';
  public static readonly SIGNUP = '/signup';
  public static readonly LOGOFF = '/logout';
  public static readonly CHANGE_PASSWORD = '/changePassword';
  public static readonly CURRENT_USER = '/currentUser';


  /**
   * Creates an instance of PassportService.
   *
   * @param {Http} http
   * @param {AppConfigService} configService
   * @param {string} _topic - das Topic des Service
   *
   * @memberOf PassportService
   */
  constructor(http: HttpClient, configService: AppConfigService) {
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
        .pipe(
          map((response: Response) => this.deserialize(response.json())),
          tap((u) => {
            log.log('user: ' + Core.stringify(u));
          }),
          catchError<IUser, any>(this.handleError)
        );
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
          .pipe(
            map((response: Response) => this.deserialize(response.json())),
            tap((u) => {
              log.log(`user = ${Core.stringify(u)}`);
            }),
            catchError<User, any>(this.handleError)
          );
      });
  }


  /**
   * Meldet den aktuellen Benutzer ab
   *
   * @returns {Observable<any>}
   *
   * @memberOf PassportService
   */
  public logoff(): Observable<any> {
    return using(new XLog(PassportService.logger, levels.INFO, 'logoff'), (log) => {
      return this.http.get(this.getUrl() + PassportService.LOGOFF)
        .pipe(
          map((response: Response) => {
            // ok
          }),
          tap((user) => {
            log.log(`user = ${Core.stringify(user)}`);
          }),
          tap((data) => PassportService.logger.info('result: ' + Core.stringify(data))),
          catchError(this.handleError)
        );
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
        .pipe(
          map((response: Response) => this.deserialize(response.json())),
          tap((user) => {
            log.log(`user = ${Core.stringify(user)}`);
          }),
          catchError<IUser, any>(this.handleError)
        );
    });
  }

}