/**
 * Interface für alle REST-Api-Implementierungen
 * 
 * @export
 * @interface IRestUri
 */
export interface IRestUri {

    /**
     * Das Topic des REST-Api (z.B. 'passport' oder 'artikel')
     * 
     * @type {string}
     * @memberOf IRestUri
     */
    topic: string;

    /**
     * die resultierende Url (baseUrl + topic, z.B. http://localhost;8000/rest/artikel)
     * 
     * @type {string}
     * @memberOf IRestUri
     */
    url: string;
}