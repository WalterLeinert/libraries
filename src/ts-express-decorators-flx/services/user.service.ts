import { Service } from 'ts-express-decorators';
import shortid = require('js-shortid');

// -------------------------- logging -------------------------------
import {
    configure, getLogger, ILogger, levels, Logger, using, XLog
} from '@fluxgate/common';
// -------------------------- logging -------------------------------

// Fluxgate
import { AppRegistry, Assert, Encryption, IUser, Role, User } from '@fluxgate/common';

import { Messages } from '../../resources/messages';
import { BaseService } from './base.service';
import { KnexService } from './knex.service';
import { MetadataService } from './metadata.service';

@Service()
export class UserService extends BaseService<IUser, number> {
    protected static logger = getLogger(UserService);

    constructor(knexSerice: KnexService, metadataService: MetadataService) {
        super(AppRegistry.instance.get<Function>(User.USER_CONFIG_KEY), knexSerice, metadataService);
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
                    reject(err);
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
                    reject(err);
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
    public create(user: IUser): Promise<IUser> {
        Assert.that(Role.isValidRole(user.role));

        user.password_salt = shortid.gen();

        return new Promise<IUser>((resolve, reject) => {
            Encryption.hashPassword(user.password, user.password_salt, (err, encryptedPassword) => {
                if (err) {
                    reject(err);
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
                    reject(err);
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

            const message = Messages.WRONG_CREDENTIALS('Benutzername');

            return new Promise<IUser>((resolve, reject) => {
                super.queryKnex(
                    super.fromTable()
                        .where('username', username))

                    .then((users) => {

                        try {

                            //
                            // Prüfung, ob users Array oder ein User
                            //
                            let user: IUser = null;
                            if (Array.isArray(users)) {
                                if (users.length <= 0 || users.length > 1) {
                                    log.log(message);
                                    reject(message);
                                    // throw new Error(message);
                                } else {
                                    user = users[0];
                                    resolve(user);
                                }
                            } else {
                                if (!users) {
                                    log.log(message);
                                    reject(message);
                                    // throw new Error(message);
                                } else {
                                    user = users;

                                    Encryption.hashPassword(password, user.password_salt, (err, encryptedPassword) => {
                                        if (err) {

                                            log.log(message);
                                            reject(message);
                                            // throw new Error(message);
                                        }

                                        if (encryptedPassword === user.password) {
                                            user.resetCredentials();
                                            log.log('user: ', user);
                                            resolve(user);
                                        } else {
                                            log.log(message + ' *');
                                            reject(message);
                                            // throw new Error(message);
                                        }
                                    });
                                }
                            }
                        } catch (err) {
                            reject(err);
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
    public findByUsername(username: string): Promise<IUser> {
        return using(new XLog(UserService.logger, levels.INFO, 'findByUsername', `username = ${username}`), (log) => {

            return new Promise<IUser>((resolve, reject) => {
                super
                    .fromTable()
                    .where('username', username)
                    .then((users) => {
                        if (!users || users.length <= 0) {
                            log.log('no user found');
                            resolve(undefined);
                        } else {
                            const user = this.createModelInstance(users[0]);
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
     * Liefert einen @see{User} für die Email @param{email} als @see{Promise} 
     * 
     * @param {string} email
     * @returns {Promise<User>}
     * 
     * @memberOf UserService
     */
    public findByEmail(email: string): Promise<IUser> {
        return using(new XLog(UserService.logger, levels.INFO, 'findByEmail', `email = ${email}`), (log) => {

            return new Promise<IUser>((resolve, reject) => {
                super
                    .fromTable()
                    .where('email', email)
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
    public findByCredentialEmail(email: string, password: string): Promise<IUser> {
        return using(new XLog(UserService.logger, levels.INFO, 'findByCredentialEmail', `email = ${email}`), (log) => {

            const message = Messages.WRONG_CREDENTIALS('Email');

            return new Promise<IUser>((resolve, reject) => {
                super.queryKnex(
                    super.fromTable()
                        .where('email', email)
                )
                    .then((users) => {
                        if (!users || users.length <= 0) {
                            log.log(message);
                            reject(message);
                        }

                        const user = users[0];

                        Encryption.hashPassword(password, user.password_salt, (err, encryptedPassword) => {
                            if (err) {
                                reject(err);
                            }

                            if (encryptedPassword === user.password) {
                                user.resetCredentials();

                                log.log('user: ', user);
                                resolve(user);
                            } else {
                                log.log(message + ' *');
                                reject(message);
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