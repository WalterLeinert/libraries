import * as Express from 'express';
import { Service } from 'ts-express-decorators';
import * as Passport from 'passport';
import { Strategy } from 'passport-local';

// -------------------------- logging -------------------------------
import { Logger, levels, getLogger } from 'log4js';
import { XLog, using } from 'enter-exit-logger';
// -------------------------- logging -------------------------------

// Fluxgate
import { IUser } from '@fluxgate/common';

import { Messages } from '../../resources/messages';
import { UserService } from './user.service';

@Service()
export class PassportLocalService {
    static logger = getLogger('PassportLocalService');

    /**
     *
     * @param user
     * @param done
     */
    static serialize(user: IUser, done) {
        using(new XLog(PassportLocalService.logger, levels.INFO, 'serialize', `user = ${user}`), (log) => {
            done(null, user.id);
        });
    }


    constructor(private userService: UserService) {

        // used to serialize the user for the session
        Passport.serializeUser(PassportLocalService.serialize);

        // used to deserialize the user
        Passport.deserializeUser(this.deserialize.bind(this));
    }


    /**
     *
     * @param id
     * @param done
     */
    public deserialize(id, done) {
        using(new XLog(PassportLocalService.logger, levels.INFO, 'deserialize', `id = ${id}`), (log) => {
            this.userService.findById(id)
                .then(user => {
                    log.log(`user = ${user}`);
                    done(null, this.userService.findById(id));
                });
        });
    }


    // =========================================================================
    // LOCAL SIGNUP ============================================================
    // =========================================================================
    // we are using named strategies since we have one for login and one for signup
    // by default, if there was no name, it would just be called 'local'
    public initLocalSignup() {

        Passport
            .use('signup', new Strategy({
                // by default, local strategy uses username and password, we will override with email
                usernameField: 'username',
                passwordField: 'password',
                passReqToCallback: true // allows us to pass back the entire request to the callback
            },
                (req, username, password, done) => {
                    // console.log('LOCAL SIGNUP', username, password);
                    // asynchronous
                    // User.findOne wont fire unless data is sent back
                    process.nextTick(() => {
                        this.onLocalSignup(req, username, password, done);
                    });
                })
            );

    }

    private onLocalSignup(req: Express.Request, username: string, password: string, done): void {
        using(new XLog(PassportLocalService.logger, levels.INFO, 'onLocalSignup', `username = ${username}`), (log) => {
            this.userService.findByUsername(username)
                .then(user => {
                    if (user) { // User exists
                        log.log(`user exists: ${user}`);

                        return done(Messages.USER_EXISTS(), false);
                    }


                    // Create new User
                    this.userService.create(<IUser>req.body)
                        .then(newUser => {
                            newUser.password = undefined;
                            newUser.password_salt = undefined;

                            log.log(`user created: ${newUser}`);
                            done(null, newUser);
                        });

                });
        });
    }

    // =========================================================================
    // LOCAL LOGIN =============================================================
    // =========================================================================
    // we are using named strategies since we have one for login and one for signup
    // by default, if there was no name, it would just be called 'local'

    public initLocalLogin() {

        Passport.use('login', new Strategy({
            // by default, local strategy uses username and password, we will override with email
            usernameField: 'username',
            passwordField: 'password',
            passReqToCallback: true // allows us to pass back the entire request to the callback
        }, this.onLocalLogin));
    }

    private onLocalLogin = (req, username, password, done) => {
        using(new XLog(PassportLocalService.logger, levels.INFO, 'onLocalLogin', `username = ${username}`), (log) => {
            this.userService.findByCredentialUsername(username, password)
                .then(user => {
                    if (!user) {
                        return done(null, false); // req.flash is the way to set flashdata using connect-flash
                    }

                    // all is well, return successful user
                    return done(null, user);
                })
                .catch(err => {
                    log.error(err);
                    done(err, false);
                });
        });

    }
}