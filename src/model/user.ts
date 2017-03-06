import { AppRegistry } from '../base/appRegistry';
import { Funktion } from '../base/objectType';
import { Enum } from '../model/decorator/model/enum';

import { Column, IUser, Role, Table, UserRoleId } from '.';


/**
 * Modelliert User im System (Defaultimplemetierung)
 */
// tslint:disable-next-line:max-classes-per-file
@Table({ name: 'user' })
export class User implements IUser {

  /**
   * der Key für den Zugriff über @see{AppRegistry}
   */
  public static readonly USER_CONFIG_KEY = 'IUser';

  @Column({ name: 'user_id', primary: true, generated: true, displayName: 'Id' })
  public id: number;

  @Column({ name: 'firstname', nullable: true, displayName: 'Firstname' })
  public firstname?: string;

  @Column({ name: 'lastname', nullable: true, displayName: 'Lastname' })
  public lastname?: string;

  @Column({ name: 'username', displayName: 'Username' })
  public username: string;

  @Column({ name: 'email', nullable: true, displayName: 'Email' })
  public email?: string;

  @Enum<Role, string, number>(() => Role, (role) => role.name, (role) => role.id)
  @Column({ name: 'id_role', displayName: 'Role-Id' })
  public role: number = UserRoleId.User;

  @Column({ name: 'password', displayName: 'Password' })
  public password: string;

  @Column({ name: 'password_salt' })
  public password_salt: string;

  @Column({ displayName: 'Name', persisted: false })
  public get fullName(): string {
    return `${this.lastname}, ${this.firstname}`;
  }


  /**
   * Setzt Passwort und Salt zurück
   * 
   * @memberOf User
   */
  public resetCredentials() {
    this.password = undefined;
    this.password_salt = undefined;
  }


  /**
   * Liefert true, falls der User ein Admin ist.
   * 
   * @readonly
   * @type {boolean}
   * @memberOf User
   */
  public get isAdmin(): boolean {
    return this.role === UserRoleId.Admin;
  }
}


/**
 * User Klasse registrieren
 */
AppRegistry.instance.add<Funktion>(User.USER_CONFIG_KEY, User);