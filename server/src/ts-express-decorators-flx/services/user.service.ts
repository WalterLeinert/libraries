import * as shortid from 'js-shortid';
import { Service } from 'ts-express-decorators';

// -------------------------- logging -------------------------------
// tslint:disable-next-line:no-unused-variable
import { getLogger, ILogger, levels, using, XLog } from '@fluxgate/platform';
// -------------------------- logging -------------------------------

// Fluxgate
import { AppRegistry, IUser, Role, User } from '@fluxgate/common';
import { Assert, Encryption, Funktion, IQuery, SelectorTerm } from '@fluxgate/core';

import { Messages } from '../../resources/messages';
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
  public findById(id: number): Promise<IUser> {
    return new Promise<IUser>((resolve, reject) => {
      super.findById(id)
        .then((user) => {
          user.resetCredentials();
          resolve(user);
        })
        .catch((err) => {
          reject(this.createSystemException(err));
        });
    });
  }

  public find(): Promise<IUser[]> {
    return new Promise<IUser[]>((resolve, reject) => {
      super.find()
        .then((users) => {
          users.forEach((user) => {
            user.resetCredentials();
          });
          resolve(users);
        })
        .catch((err) => {
          reject(this.createSystemException(err));
        });
    });
  }

  public update(user: IUser): Promise<IUser> {
    if (user.role) {
      Assert.that(Role.isValidRole(user.role));
    }
    return new Promise<IUser>((resolve, reject) => {
      super.update(user)
        .then((u) => {
          u.resetCredentials();
          resolve(u);
        })
        .catch((err) => {
          reject(this.createSystemException(err));
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
  public create(user: IUser): Promise<IUser> {
    Assert.that(Role.isValidRole(user.role));

    user.password_salt = shortid.gen();

    return new Promise<IUser>((resolve, reject) => {
      Encryption.hashPassword(user.password, user.password_salt, (err, encryptedPassword) => {
        if (err) {
          reject(this.createSystemException(err));
        }

        user.password = encryptedPassword;

        super.create(user).then((u) => {
          u.resetCredentials();
          resolve(u);
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
  public changePassword(user: IUser): Promise<IUser> {
    Assert.that(Role.isValidRole(user.role));

    user.password_salt = shortid.gen();

    return new Promise<IUser>((resolve, reject) => {
      Encryption.hashPassword(user.password, user.password_salt, (err, encryptedPassword) => {
        if (err) {
          reject(this.createSystemException(err));
        }

        user.password = encryptedPassword;

        super.update(user).then((u) => {
          u.resetCredentials();
          resolve(u);
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
  public findByCredentialUsername(username: string, password: string): Promise<IUser> {
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
          this.query(query)
            .then((users) => {

              try {

                //
                // Prüfung, ob users Array oder ein User
                //
                let user: IUser = null;


                if (!users) {
                  log.log(message);
                  reject(this.createBusinessException(message));
                } else {
                  if (!Array.isArray(users)) {
                    reject(this.createSystemException('internal error: array expected'));
                  }
                }

                // no user found?
                if (users.length <= 0 || users.length > 1) {
                  log.log(message);
                  reject(this.createBusinessException(message));
                } else {
                  user = users[0];

                  Encryption.hashPassword(password, user.password_salt, (err, encryptedPassword) => {
                    if (err) {
                      log.log(message);
                      reject(this.createBusinessException(message));
                    }

                    if (encryptedPassword === user.password) {
                      user.resetCredentials();
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
              reject(this.createSystemException(err));
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
  public findByUsername(username: string): Promise<IUser> {
    return using(new XLog(UserService.logger, levels.INFO, 'findByUsername', `username = ${username}`), (log) => {
      const query: IQuery = {
        term: new SelectorTerm({
          name: 'username',
          operator: '=',
          value: username
        })
      };

      return new Promise<IUser>((resolve, reject) => {
        this.query(query)
          .then((users) => {
            if (!users || users.length <= 0) {
              log.log('no user found');
              resolve(undefined);
            } else {
              const user = users[0];
              user.resetCredentials();
              log.log('user: ', user);
              resolve(user);
            }

          })
          .catch((err) => {
            log.error(err);
            reject(this.createSystemException(err));
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
  public findByEmail(email: string): Promise<IUser> {
    return using(new XLog(UserService.logger, levels.INFO, 'findByEmail', `email = ${email}`), (log) => {
      const query: IQuery = {
        term: new SelectorTerm({
          name: 'email',
          operator: '=',
          value: email
        })
      };

      return new Promise<IUser>((resolve, reject) => {
        this.query(query)
          .then((users) => {
            if (!users || users.length <= 0) {
              log.log('no user found');
              resolve(undefined);
            } else {
              const user = users[0];
              user.resetCredentials();
              log.log('user: ', user);
              resolve(user);
            }
          })
          .catch((err) => {
            log.error(err);
            reject(this.createSystemException(err));
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
  public findByCredentialEmail(email: string, password: string): Promise<IUser> {
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
        this.query(query)
          .then((users) => {
            if (!users || users.length <= 0) {
              log.log(message);
              reject(this.createBusinessException(message));
            }

            const user = users[0];

            Encryption.hashPassword(password, user.password_salt, (err, encryptedPassword) => {
              if (err) {
                reject(this.createSystemException(err));
              }

              if (encryptedPassword === user.password) {
                user.resetCredentials();

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
            reject(this.createSystemException(err));
          });
      });
    });
  }
}