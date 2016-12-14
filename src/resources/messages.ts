/**
 * Server Messagetexte
 * 
 * @export
 * @class Messages
 */
export class Messages {
    static AUTHENTICATION_REQUIRED = () => `Zugang nicht erlaubt. Angemeldet?`;
    static USER_EXISTS = () => `Benutzer existiert bereits.`;
    static WRONG_CREDENTIALS = (cred: string) => `${cred} oder Password falsch`;
}