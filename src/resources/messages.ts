/**
 * Server Messagetexte
 * 
 * @export
 * @class Messages
 */
export class Messages {
    static AUTHENTICATION_REQUIRED = () => `Zugang nicht erlaubt. Angemeldet?`;
    static USER_EXISTS = () => `Benutzer existiert bereits.`;
    static USER_DOES_NOT_EXIST = (username: string) => `Benutzer ${username} existiert nicht.`;
    static USERS_DO_NOT_MATCH = (username: string, requestUsername: string) =>
        'Das Kennwort kann nicht geändert werden: ' +
        `Benutzer ${username} stimmt nicht mit dem aktuellen Benutzer ${requestUsername} überein.`;
    static WRONG_CREDENTIALS = (cred: string) => `${cred} oder Password falsch`;
}