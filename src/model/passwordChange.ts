
/**
 * Hilfsklasse zum Übertragen eines REST-Requests für das Ändern des Passworts.
 * 
 * @export
 * @class PasswordChange
 */
export class PasswordChange {

    constructor(public username: string, public password: string, public passwordNew: string) {
    }
}