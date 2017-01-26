import { IEntity } from './entity.interface';

/**
 * Interface für User
 */
export interface IUser extends IEntity {
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
     * Setzt Passwort und Salt zurück
     * 
     * @memberOf User
     */
    resetCredentials();
}