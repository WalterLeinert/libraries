import { Funktion, StringBuilder, Utility } from '@fluxgate/core';

import { AppRegistry } from '../base/appRegistry';
import { Column } from '../model/decorator/column';
import { Enum } from '../model/decorator/enum';
import { IdColumn } from '../model/decorator/id-column';
import { Secret } from '../model/decorator/secret';
import { Table } from '../model/decorator/table';
import { Validation } from '../model/decorator/validation';
import { FlxStatusEntity } from '../model/flx-status-entity';
import { Validators } from '../model/validation/validators';


// import { Mandant } from './mandant';
import { Role, UserRoleId } from './role';
import { IUser } from './user.interface';


/**
 * Modelliert User im System (Defaultimplemetierung)
 */
// tslint:disable-next-line:max-classes-per-file
@Table({ name: User.TABLE_NAME })
export class User extends FlxStatusEntity<number> implements IUser {
  public static readonly TABLE_NAME = 'user';

  /**
   * der Key für den Zugriff über @see{AppRegistry}
   */
  public static readonly USER_CONFIG_KEY = 'IUser';

  public static Null = new User(-1, '-no-name-', -1, 'none');


  @IdColumn({ name: 'user_id', displayName: 'Id' })
  public id: number;

  @Column({ name: 'user_firstname', nullable: true, displayName: 'Firstname' })
  public firstname?: string;

  @Column({ name: 'user_lastname', nullable: true, displayName: 'Lastname' })
  public lastname?: string;

  @Validation([
    Validators.required
  ])
  @Column({ name: 'user_username', displayName: 'Username' })
  public username: string;

  @Validation([
    Validators.required,
    Validators.email
  ])
  @Column({ name: 'user_email', nullable: true, displayName: 'Email' })
  public email?: string;

  @Validation([
    Validators.required
  ])
  @Enum<Role, string, number>(() => Role, (role) => role.name, (role) => role.id, true)
  @Column({ name: 'id_role', displayName: 'Role' })
  public role: number = UserRoleId.User;

  @Validation([
    Validators.required,
    Validators.range({ min: 8 })
  ])
  @Secret()
  @Column({ name: 'user_password', displayName: 'Password' })
  public password: string;

  @Secret()
  @Column({ name: 'user_password_salt', hidden: true })
  public password_salt: string;


  @Column({ displayName: 'Name', persisted: false })
  public get fullName(): string {
    const sb = new StringBuilder(this.lastname);
    if (!Utility.isNullOrEmpty(this.firstname)) {
      sb.append(', ');
      sb.append(this.firstname);
    }
    return sb.toString();
  }


  constructor(id?: number, username?: string, role?: number, lastname?: string) {
    super();

    this.id = id;
    this.username = username;
    this.role = role;
    this.lastname = lastname;
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

  public get isNull(): boolean {
    return this.id === User.Null.id;
  }
}


/**
 * User Klasse registrieren
 */
AppRegistry.instance.add<Funktion>(User.USER_CONFIG_KEY, User);