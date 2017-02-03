/**
 * Server Messagetexte
 * 
 * @export
 * @class Messages
 */
export class Messages {
    public static AUTHENTICATION_REQUIRED = () => `Zugang nicht erlaubt. Angemeldet?`;
    public static USER_EXISTS = () => `Benutzer existiert bereits.`;
    public static USER_DOES_NOT_EXIST = (username: string) => `Benutzer ${username} existiert nicht.`;
    public static USERS_DO_NOT_MATCH = (username: string, requestUsername: string) =>
        'Das Kennwort kann nicht geändert werden: ' +
        `Benutzer ${username} stimmt nicht mit dem aktuellen Benutzer ${requestUsername} überein.`;
    public static WRONG_CREDENTIALS = (cred: string) => `${cred} oder Password falsch`;
}