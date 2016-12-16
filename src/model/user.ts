import { AppRegistry } from '../base';
import { IUser, UserRoleId, Table, Column } from '.';

/**
 * Modelliert User im System (Defaultimplemetierung)
 */
@Table({ name: 'user' })
export class User implements IUser {

  /**
  * der Key für den Zugriff über @see{AppRegistry}
  */
  public static readonly USER_CONFIG_KEY = 'IUser';

  @Column({ name: 'user_id', primary: true, generated: true })
  public id: number;

  @Column({ name: 'firstname', nullable: true })
  public firstname?: string;

  @Column({ name: 'lastname', nullable: true })
  public lastname?: string;

  @Column({ name: 'username' })
  public username: string;

  @Column({ name: 'email', nullable: true })
  public email?: string;

  @Column({ name: 'id_role' })
  public role: number = UserRoleId.User;

  @Column({ name: 'password' })
  public password: string;

  @Column({ name: 'password_salt' })
  public password_salt: string;
}

/**
 * User Klasse registrieren
 */
AppRegistry.instance.add<Function>(User.USER_CONFIG_KEY, User);