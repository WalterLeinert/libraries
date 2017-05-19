import * as Passport from 'passport';
import { Strategy } from 'passport-local';
import { Service } from 'ts-express-decorators';

// -------------------------- logging -------------------------------
// tslint:disable-next-line:no-unused-variable
import { getLogger, ILogger, levels, using, XLog } from '@fluxgate/platform';
// -------------------------- logging -------------------------------

// Fluxgate
import { IUser } from '@fluxgate/common';

import { MetadataService, UserService } from '.';
import { Messages } from '../../resources/messages';
import { IBodyRequest } from '../session/body-request.interface';
import { ISessionRequest } from '../session/session-request.interface';

@Service()
export class PassportLocalService {
  protected static logger = getLogger(PassportLocalService);

  /**
   *
   * @param user
   * @param done
   */
  public static serialize(user: IUser, done) {
    using(new XLog(PassportLocalService.logger, levels.INFO, 'serialize', `user = ${user}`), (log) => {
      done(null, user.id);
    });
  }


  constructor(private userService: UserService, private metadataService: MetadataService) {

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
      this.userService.findById(undefined, id)
        .then((userResult) => {
          log.log(`user = ${userResult}`);
          done(null, userResult.item);
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
        (request: ISessionRequest, username: string, password: string, done) => {
          // console.log('LOCAL SIGNUP', username, password);
          // asynchronous
          // User.findOne wont fire unless data is sent back
          process.nextTick(() => {
            this.onLocalSignup(request, username, password, done);
          });
        })
      );

  }

  // =========================================================================
  // LOCAL SIGNUP ============================================================
  // =========================================================================
  // we are using named strategies since we have one for login and one for signup
  // by default, if there was no name, it would just be called 'local'
  public initLocalChangePassword() {

    Passport
      .use('changePassword', new Strategy({
        // by default, local strategy uses username and password, we will override with email
        usernameField: 'username',
        passwordField: 'password',
        passReqToCallback: true // allows us to pass back the entire request to the callback
      },
        (request: ISessionRequest, username: string, password: string, done) => {
          // console.log('LOCAL SIGNUP', username, password);
          // asynchronous
          // User.findOne wont fire unless data is sent back
          process.nextTick(() => {
            this.onLocalChangePassword(request, username, password, done);
          });
        })
      );

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

  private onLocalLogin = (request: IBodyRequest<IUser>, username: string, password: string, done) => {
    using(new XLog(PassportLocalService.logger, levels.INFO, 'onLocalLogin', `username = ${username}`), (log) => {

      this.userService.findByCredentialUsername(request, username, password)
        .then((user) => {
          if (!user) {
            return done(null, false); // req.flash is the way to set flashdata using connect-flash
          }

          // all is well, return successful user
          return done(null, user);
        })
        .catch((err) => {
          log.error(err);
          done(err, false);
        });
    });
  }


  private onLocalSignup(request: ISessionRequest, username: string, password: string, done): void {
    using(new XLog(PassportLocalService.logger, levels.INFO, 'onLocalSignup', `username = ${username}`), (log) => {

      this.userService.findByUsername(request, username)
        .then((user) => {
          if (user) { // User exists
            log.log(`user exists: ${user}`);

            return done(Messages.USER_EXISTS(), false);
          }

          // Create new User
          this.userService.create(request, request.body as IUser)
            .then((result) => {
              result.item.resetCredentials();

              log.log(`user created: ${result}`);
              done(null, result);
            });

        });
    });
  }


  private onLocalChangePassword(request: ISessionRequest, username: string, password: string, done): void {
    using(new XLog(PassportLocalService.logger, levels.INFO, 'onLocalChangePassword', `username = ${username}`),
      (log) => {

        this.userService.findByUsername(request, username)
          .then((user) => {
            if (!user) { // User does not exist (should not happen)
              log.log(`user does not exist: ${username}`);

              return done(Messages.USER_DOES_NOT_EXIST(username), false);
            }

            // aktuelle credentials prüfen
            this.userService.findByCredentialUsername(request, username, password)
              .then((usr) => {
                if (!usr) {
                  return done(null, false);
                }

                // neues Passwort übernehmen
                user.password = request.body.passwordNew;

                // Create new User
                this.userService.changePassword(request, user)
                  .then((result) => {
                    result.item.resetCredentials();

                    log.log(`user updated: ${result}`);
                    done(null, result);
                  });
              })
              .catch((err) => {
                log.error(err);
                done(err, false);
              });

          });
      });
  }

}