import { AppRegistry } from '../base/appRegistry';
import { Funktion } from '../base/objectType';
import { Column } from '../model/decorator/model/column';
import { Enum } from '../model/decorator/model/enum';
import { Table } from '../model/decorator/model/table';
import { Validation } from '../model/decorator/model/validation';
import { Validators } from '../model/validation/validators';

import { Role, UserRoleId } from './role';
import { IUser } from './user.interface';


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

  @Validation([
    Validators.required
  ])
  @Column({ name: 'username', displayName: 'Username' })
  public username: string;

  @Validation([
    Validators.required,
    Validators.email
  ])
  @Column({ name: 'email', nullable: true, displayName: 'Email' })
  public email?: string;

  @Validation([
    Validators.required
  ])
  @Enum<Role, string, number>(() => Role, (role) => role.name, (role) => role.id, true)
  @Column({ name: 'id_role', displayName: 'Role-Id' })
  public role: number = UserRoleId.User;

  @Validation([
    Validators.required,
    Validators.range({ min: 8 })
  ])
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