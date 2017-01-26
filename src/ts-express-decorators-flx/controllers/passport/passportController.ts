import { NotFound } from 'ts-httpexceptions';
import * as Express from 'express';
import { Controller, Get, Post, BodyParams, Required, Request, Response, Next } from 'ts-express-decorators';
import * as Passport from 'passport';

// -------------------------- logging -------------------------------
import { Logger, levels, getLogger } from 'log4js';
import { XLog, using } from 'enter-exit-logger';
// -------------------------- logging -------------------------------

// Fluxgate
import { IUser } from '@fluxgate/common';
import { PassportLocalService } from '../../services/passportLocal.service';


/**
 * Controller zur Authentifizierung über Passport.js
 * 
 * @class PassportController
 */
@Controller('/passport')
export class PassportController {
    static logger = getLogger('PassportController');

    constructor(passportLocalService: PassportLocalService) {
        passportLocalService.initLocalSignup();
        passportLocalService.initLocalLogin();
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
}