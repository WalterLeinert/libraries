import { NotFound } from 'ts-httpexceptions';

import * as Express from 'express';
import * as Passport from 'passport';
import { BodyParams, Controller, Get, Next, Post, Request, Required, Response } from 'ts-express-decorators';

// -------------------------- logging -------------------------------
import { using, XLog } from 'enter-exit-logger';
import { getLogger, levels, Logger } from 'log4js';
// -------------------------- logging -------------------------------

// Fluxgate
import { IUser, ServiceResult } from '@fluxgate/common';
import { PassportLocalService } from '../../services/passportLocal.service';

import { Messages } from '../../../resources/messages';

/**
 * Controller zur Authentifizierung über Passport.js
 * 
 * @class PassportController
 */
@Controller('/passport')
export class PassportController {
    protected static logger = getLogger('PassportController');

    constructor(passportLocalService: PassportLocalService) {
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
        @Request() request: Express.Request,
        @Response() response: Express.Response,
        @Next() next: Express.NextFunction
        ): Promise<IUser> {

        return using(new XLog(PassportController.logger, levels.INFO, 'login', `username = ${username}`), (log) => {
            return new Promise<IUser>((resolve, reject) => {

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

                                user.resetCredentials();
                                resolve(user);
                            });

                        })(request, response, next);
                } catch (err) {
                    log.error(err);
                    return reject(err);
                }
            })
                .catch((err) => {
                    if (err && err.message === 'Failed to serialize user into session') {
                        throw new NotFound('user not found');
                    }
                    return Promise.reject(err);
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
        @Request() request: Express.Request,
        @Response() response: Express.Response,
        @Next() next: Express.NextFunction
        ): Promise<IUser> {

        return using(new XLog(PassportController.logger, levels.INFO, 'signup'), (log) => {
            return new Promise<IUser>((resolve, reject) => {

                Passport.authenticate('signup', (err, user: IUser) => {
                    if (err) {
                        return reject(err);
                    }
                    if (!user) {
                        return reject(!!err);
                    }

                    request.logIn(user, (loginErr) => {
                        if (loginErr) {
                            return reject(loginErr);
                        }

                        user.resetCredentials();
                        return resolve(user);
                    });

                })(request, response, next);
            });
        });
    }

    /**
     * Disconnect user
     * @param request
     */
    @Get('/logout')
    public logout( @Request() request: Express.Request) {
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
        @Request() request: Express.Request,
        @Response() response: Express.Response,
        @Next() next: Express.NextFunction
        ): Promise<IUser> {

        return using(new XLog(PassportController.logger, levels.INFO, 'changePassword'), (log) => {
            return new Promise<IUser>((resolve, reject) => {

                try {
                    if (username !== request.user.username) {
                        log.error(`username (${username}) !== request.user.username (${request.user.username})`);
                        reject(new Error(`${Messages.USERS_DO_NOT_MATCH(username, request.user.username)}`));
                        return;
                    }

                    request.user.password = passwordNew;

                    Passport
                        .authenticate('changePassword', (err, changedUser: IUser) => {
                            if (err) {
                                return reject(err);
                            }

                            request.logIn(changedUser, (loginErr) => {
                                if (loginErr) {
                                    return reject(loginErr);
                                }

                                changedUser.resetCredentials();
                                resolve(changedUser);
                            });

                        })(request, response, next);
                } catch (err) {
                    log.error(err);
                    return reject(err);
                }
            })
                .catch((err) => {
                    if (err && err.message === 'Failed to serialize user into session') {
                        throw new NotFound('user not found');
                    }
                    return Promise.reject(err);
                });
        });
    }


    /**
     * Liefert den aktuell angemeldeten User.
     * 
     * @param request
     */
    @Get('/currentUser')
    public getCurrentUser( @Request() request: Express.Request): Promise<IUser> {
        return using(new XLog(PassportController.logger, levels.INFO, 'currentUser'), (log) => {
            return new Promise<IUser>((resolve, reject) => {
                return resolve(request.user ? request.user : null);
            });
        });
    }
}