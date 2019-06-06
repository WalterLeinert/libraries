/**
 * Server Messagetexte
 *
 * @export
 * @class Messages
 */
export class Messages {
    public static readonly AUTHENTICATION_REQUIRED = () => `Zugang nicht erlaubt. Angemeldet?`;
    public static readonly USER_EXISTS = () => `Benutzer existiert bereits.`;
    public static readonly WRONG_CREDENTIALS = (cred: string) => `${cred} oder Password falsch`;
}