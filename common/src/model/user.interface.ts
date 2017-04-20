import { IFlxEntity } from './flx-entity.interface';

/**
 * Interface für User
 */
export interface IUser extends IFlxEntity<number> {
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
  password_salt: string;

  /**
   * Liefert true, falls der User ein Admin ist.
   *
   * @readonly
   * @type {boolean}
   * @memberOf User
   */
  isAdmin: boolean;

  /**
   * liefert true, falls die Entity als gelöscht markiert ist
   */
  deleted?: boolean;

  /**
   * Mandanten-Id
   */
  id_mandant?: number;

  /**
   * Setzt Passwort und Salt zurück
   *
   * @memberOf User
   */
  resetCredentials();
}