import * as shortid from 'js-shortid';
import { Service } from 'ts-express-decorators';

// -------------------------- logging -------------------------------
// tslint:disable-next-line:no-unused-variable
import { getLogger, ILogger, levels, using, XLog } from '@fluxgate/platform';
// -------------------------- logging -------------------------------

// Fluxgate
import {
  AppRegistry, CreateResult, FindByIdResult, FindResult, IUser,
  Role, UpdateResult, User
} from '@fluxgate/common';
import { Assert, Encryption, Funktion, IQuery, SelectorTerm, Types } from '@fluxgate/core';

import { Messages } from '../../resources/messages';
import { ISessionRequest } from '../session/session-request.interface';
import { BaseService } from './baseService';
import { KnexService } from './knex.service';
import { MetadataService } from './metadata.service';


@Service()
export class UserService extends BaseService<IUser, number> {
  protected static logger = getLogger(UserService);

  constructor(knexSerice: KnexService, metadataService: MetadataService) {
    super(AppRegistry.instance.get<Funktion>(User.USER_CONFIG_KEY), knexSerice, metadataService);
  }


  // ----------------------------------------------------------------
  // überschriebene Methoden (Passwort-Info zurücksetzen bzw. User anlegen)
  // ----------------------------------------------------------------
  public findById(request: ISessionRequest, id: number): Promise<FindByIdResult<IUser, number>> {
    return new Promise<FindByIdResult<IUser, number>>((resolve, reject) => {
      super.findById(request, id)
        .then((result) => {
          this.metadataService.resetSecrets(result.item);
          resolve(result);
        })
        .catch((err) => {
          reject(err);
        });
    });
  }

  public find(request: ISessionRequest): Promise<FindResult<IUser>> {
    return new Promise<FindResult<IUser>>((resolve, reject) => {
      super.find(request)
        .then((result) => {
          result.items.forEach((user) => {
            this.metadataService.resetSecrets(user);
          });
          resolve(result);
        })
        .catch((err) => {
          reject(err);
        });
    });
  }

  public update(request: ISessionRequest, user: IUser): Promise<UpdateResult<IUser, number>> {
    if (user.role) {
      Assert.that(Role.isValidRole(user.role));
    }
    return new Promise<UpdateResult<IUser, number>>((resolve, reject) => {
      super.update(request, user)
        .then((result) => {
          this.metadataService.resetSecrets(result.item);
          resolve(result);
        })
        .catch((err) => {
          reject(err);
        });
    });
  }


  /**
   * Erzeugt einen neuen User in der DB und liefert die Instanz als @see{Promise}.
   * Das Passwort wird zusammen mit einem Salt als Hash beim User hinterlegt.
   *
   * @param {User} user
   * @returns {Promise<User>}
   *
   * @memberOf UserService
   */
  public create(request: ISessionRequest, user: IUser): Promise<CreateResult<IUser, number>> {
    Assert.that(Role.isValidRole(user.role));

    user.passwordSalt = shortid.gen();

    return new Promise<CreateResult<IUser, number>>((resolve, reject) => {
      Encryption.hashPassword(user.password, user.passwordSalt, (err, encryptedPassword) => {
        if (err) {
          reject(this.createSystemException(err));
        }

        user.password = encryptedPassword;

        super.create(request, user).then((result) => {
          this.metadataService.resetSecrets(result.item);
          resolve(result);
        });
      });
    });
  }

  /**
   * Ändert für den existierenden User das Passwort in der DB und liefert die Instanz als @see{Promise}.
   * Das Passwort wird zusammen mit einem Salt als Hash beim User hinterlegt.
   *
   * @param {User} user - mit neuem Passwort
   * @returns {Promise<User>}
   *
   * @memberOf UserService
   */
  public changePassword(request: ISessionRequest, user: IUser): Promise<UpdateResult<IUser, number>> {
    Assert.that(Role.isValidRole(user.role));

    user.passwordSalt = shortid.gen();

    return new Promise<UpdateResult<IUser, number>>((resolve, reject) => {
      Encryption.hashPassword(user.password, user.passwordSalt, (err, encryptedPassword) => {
        if (err) {
          reject(this.createSystemException(err));
        }

        user.password = encryptedPassword;

        super.update(request, user).then((result) => {
          this.metadataService.resetSecrets(result.item);
          resolve(result);
        });
      });
    });
  }
  // ----------------------------------------------------------------
  // Ende: überschriebene Methoden
  // ----------------------------------------------------------------


  /**
   * Liefert einen @see{User} für den Benutzernamen @param{username} und das Passwort @param{password}
   * als @see{Promise}, falls der Benutzer mit diesen Credentials existiert.
   *
   * @param {string} username
   * @param {string} password
   * @returns {Promise<User>}
   *
   * @memberOf UserService
   */
  public findByCredentialUsername(request: ISessionRequest, username: string, password: string): Promise<IUser> {
    return using(new XLog(UserService.logger, levels.INFO, 'findByCredentialUsername', `username = ${username}`),
      (log) => {
        const query: IQuery = {
          term: new SelectorTerm({
            name: 'username',
            operator: '=',
            value: username
          })
        };

        const message = Messages.WRONG_CREDENTIALS('Benutzername');

        return new Promise<IUser>((resolve, reject) => {
          this.query(request, query)
            .then((result) => {

              try {

                //
                // Prüfung, ob users Array oder ein User
                //
                let user: IUser = null;


                if (Types.isNull(result.items)) {
                  log.log(message);
                  reject(this.createBusinessException(message));
                } else {
                  if (!Array.isArray(result.items)) {
                    reject(this.createSystemException('internal error: array expected'));
                  }
                }

                // no user found?
                if (result.items.length <= 0 || result.items.length > 1) {
                  log.log(message);
                  reject(this.createBusinessException(message));
                } else {
                  user = result.items[0];

                  Encryption.hashPassword(password, user.passwordSalt, (err, encryptedPassword) => {
                    if (err) {
                      log.log(message);
                      reject(this.createBusinessException(message));
                    }

                    if (encryptedPassword === user.password) {
                      this.metadataService.resetSecrets(user);
                      log.log('user: ', user);
                      resolve(user);
                    } else {
                      log.log(message + ' *');
                      reject(this.createBusinessException(message));
                    }
                  });
                }

              } catch (err) {
                reject(this.createSystemException(err));
              }
            })
            .catch((err) => {
              log.error(err);
              reject(err);
            });
        });

      });
  }


  /**
   * Liefert einen @see{User} für den Namen @param{username} als @see{Promise}
   *
   * @param {string} username
   * @returns {Promise<User>}
   *
   * @memberOf UserService
   */
  public findByUsername(request: ISessionRequest, username: string): Promise<IUser> {
    return using(new XLog(UserService.logger, levels.INFO, 'findByUsername', `username = ${username}`), (log) => {
      const query: IQuery = {
        term: new SelectorTerm({
          name: 'username',
          operator: '=',
          value: username
        })
      };

      return new Promise<IUser>((resolve, reject) => {
        this.query(request, query)
          .then((result) => {
            if (Types.isNullOrEmpty(result.items)) {
              log.log('no user found');
              resolve(undefined);
            } else {
              const user = result.items[0];
              this.metadataService.resetSecrets(user);
              log.log('user: ', user);
              resolve(user);
            }

          })
          .catch((err) => {
            log.error(err);
            reject(err);
          });
      });
    });
  }


  /**
   * Liefert einen @see{User} für die Email @param{email} als @see{Promise}
   *
   * @param {string} email
   * @returns {Promise<User>}
   *
   * @memberOf UserService
   */
  public findByEmail(request: ISessionRequest, email: string): Promise<IUser> {
    return using(new XLog(UserService.logger, levels.INFO, 'findByEmail', `email = ${email}`), (log) => {
      const query: IQuery = {
        term: new SelectorTerm({
          name: 'email',
          operator: '=',
          value: email
        })
      };

      return new Promise<IUser>((resolve, reject) => {
        this.query(request, query)
          .then((result) => {
            if (Types.isNullOrEmpty(result.items)) {
              log.log('no user found');
              resolve(undefined);
            } else {
              const user = result[0];
              user.resetCredentials();
              log.log('user: ', user);
              resolve(user);
            }
          })
          .catch((err) => {
            log.error(err);
            reject(err);
          });
      });
    });
  }


  /**
   * Liefert einen @see{User} für die Email @param{email} und das Passwort @param{password} als @see{Promise},
   * falls der Benutzer mit diesen Credentials existiert.
   *
   * @param {string} email
   * @param {string} password
   * @returns
   *
   * @memberOf UserService
   */
  public findByCredentialEmail(request: ISessionRequest, email: string, password: string): Promise<IUser> {
    return using(new XLog(UserService.logger, levels.INFO, 'findByCredentialEmail', `email = ${email}`), (log) => {
      const query: IQuery = {
        term: new SelectorTerm({
          name: 'email',
          operator: '=',
          value: email
        })
      };

      const message = Messages.WRONG_CREDENTIALS('Email');

      return new Promise<IUser>((resolve, reject) => {
        this.query(request, query)
          .then((result) => {
            if (Types.isNullOrEmpty(result.items)) {
              log.log(message);
              reject(this.createBusinessException(message));
            }

            const user = result.items[0];

            Encryption.hashPassword(password, user.passwordSalt, (err, encryptedPassword) => {
              if (err) {
                reject(this.createSystemException(err));
              }

              if (encryptedPassword === user.password) {
                this.metadataService.resetSecrets(user);

                log.log('user: ', user);
                resolve(user);
              } else {
                log.log(message + ' *');
                reject(this.createBusinessException(message));
              }

            });
          })
          .catch((err) => {
            log.error(err);
            reject(err);
          });
      });
    });
  }
}