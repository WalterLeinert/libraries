import { IFlxStatusEntity } from './flx-status-entity.interface';

/**
 * Interface für User
 */
export interface IUser extends IFlxStatusEntity<number> {
  /**
   * Der Benutzername (login)
   */
  username: string;

  /**
   * die zugehörige Rolle
   */
  role: number;

  /**
   * Das Passwort (verschlüsselt)
   */
  password: string;

  /**
   * Das Passwort Salt (für Verschlüsselung)
   */
  passwordSalt: string;

  /**
   * Liefert true, falls der User ein Admin ist.
   *
   * @readonly
   * @type {boolean}
   * @memberOf User
   */
  isAdmin: boolean;
}