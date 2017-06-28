import * as Express from 'express';
import * as Passport from 'passport';
import { BodyParams, Controller, Get, Next, Post, Request, Required, Response } from 'ts-express-decorators';

// -------------------------- logging -------------------------------
// tslint:disable-next-line:no-unused-variable
import { getLogger, ILogger, levels, using, XLog } from '@fluxgate/platform';
// -------------------------- logging -------------------------------

// Fluxgate
import { ExceptionWrapper, IUser, TableMetadata, User } from '@fluxgate/common';
import { IException } from '@fluxgate/core';

import { Messages } from '../../resources/messages';
import { MetadataService } from '../services/metadata.service';
import { PassportLocalService } from '../services/passportLocal.service';
import { IBodyRequest } from '../session/body-request.interface';
import { ISessionRequest } from '../session/session-request.interface';
import { ControllerCore } from './base/controller-core';


/**
 * Controller zur Authentifizierung über Passport.js
 *
 * @class PassportController
 */
@Controller('/passport')
export class PassportController extends ControllerCore {
  protected static logger = getLogger(PassportController);


  constructor(passportLocalService: PassportLocalService, private metadataService: MetadataService) {
    super(passportLocalService);

    passportLocalService.initLocalSignup();
    passportLocalService.initLocalLogin();
    passportLocalService.initLocalChangePassword();
  }


  /**
   * Authenticate user with local info (in Database).
   *
   * @param email
   * @param password
   * @param request
   * @param response
   * @param next
   */
  @Post('/login')
  public login(
    @Required() @BodyParams('username') username: string,
    @Required() @BodyParams('password') password: string,
    @Request() request: IBodyRequest<IUser>,
    @Response() response: Express.Response,
    @Next() next: Express.NextFunction
    ): Promise<IUser> {

    return using(new XLog(PassportController.logger, levels.INFO, 'login', `username = ${username}`), (log) => {
      return new Promise<IUser>((resolve, reject) => {

        request.body = this.deserialize<User>(request.body);

        try {
          Passport
            .authenticate('login', (err, user: IUser) => {
              if (err) {
                return reject(err);
              }

              request.logIn(user, (loginErr) => {
                if (loginErr) {
                  return reject(loginErr);
                }

                this.metadataService.resetSecrets(user);
                resolve(this.serialize(user));
              });

            })(request, response, next);
        } catch (err) {
          log.error(err);
          return reject(this.createBusinessException(err));
        }
      })
        .catch((err) => {
          if (err && err.message === 'Failed to serialize user into session') {
            return Promise.reject(this.createSystemException('user not found'));
          }
          return Promise.reject(this.createSystemException(err));
        });
    });
  }


  /**
   * Try to register new account
   * @param request
   * @param response
   * @param next
   */
  @Post('/signup')
  public signup(
    @Request() request: ISessionRequest,
    @Response() response: Express.Response,
    @Next() next: Express.NextFunction
    ): Promise<IUser> {

    return using(new XLog(PassportController.logger, levels.INFO, 'signup'), (log) => {
      return new Promise<IUser>((resolve, reject) => {

        Passport.authenticate('signup', (err, user: IUser) => {
          if (err) {
            return reject(this.createBusinessException(err));
          }
          if (!user) {
            return reject(!!err);
          }

          return resolve(this.serialize(user));

        })(request, response, next);
      });
    });
  }

  /**
   * Disconnect user
   * @param request
   */
  @Get('/logout')
  public logout(
    @Request() request: Express.Request
    ) {
    return using(new XLog(PassportController.logger, levels.INFO, 'logout'), (log) => {
      request.logout();
      return 'Disconnected';
    });
  }


  /**
   * Ändert das Passwort für den Benutzer mit @{username}
   *
   * @param {string} username
   * @param {string} password
   * @param {string} passwordNew
   * @param {Express.Request} request
   * @param {Express.Response} response
   * @param {Express.NextFunction} next
   * @returns {Promise<IUser>}
   *
   * @memberOf PassportController
   */
  @Post('/changePassword')
  public changePassword(
    @Required() @BodyParams('username') username: string,
    @Required() @BodyParams('password') password: string,
    @Required() @BodyParams('passwordNew') passwordNew: string,
    @Request() request: ISessionRequest,
    @Response() response: Express.Response,
    @Next() next: Express.NextFunction
    ): Promise<IUser> {

    return using(new XLog(PassportController.logger, levels.INFO, 'changePassword'), (log) => {
      return new Promise<IUser>((resolve, reject) => {

        try {
          if (username !== request.user.username) {
            log.error(`username (${username}) !== request.user.username (${request.user.username})`);
            reject(this.createBusinessException(
              `${Messages.USERS_DO_NOT_MATCH(username, request.user.username)}`));
            return;
          }

          request.user.password = passwordNew;

          Passport
            .authenticate('changePassword', (err, changedUser: IUser) => {
              if (err) {
                return reject(err);
              }

              resolve(this.serialize(changedUser));

            })(request, response, next);
        } catch (err) {
          log.error(err);
          return reject(this.createSystemException(err));
        }
      })
        .catch((err) => {
          if (err && err.message === 'Failed to serialize user into session') {
            return Promise.reject(this.createBusinessException('user not found'));
          }
          return Promise.reject(this.createSystemException(err));
        });
    });
  }


  /**
   * Liefert den aktuell angemeldeten User.
   *
   * @param request
   */
  @Get('/currentUser')
  public getCurrentUser(
    @Request() request: ISessionRequest
    ): Promise<IUser> {
    return using(new XLog(PassportController.logger, levels.INFO, 'currentUser'), (log) => {
      return new Promise<IUser>((resolve, reject) => {
        return resolve(this.serialize(request.user ? request.user : User.Null));
      });
    });
  }


  protected createBusinessException(error: string | IException | Error): IException {
    return ExceptionWrapper.createBusinessException(error);
  }

  protected createSystemException(error: string | IException | Error): IException {
    return ExceptionWrapper.createSystemException(error);
  }

}