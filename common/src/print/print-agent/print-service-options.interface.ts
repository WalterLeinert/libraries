export type RestMethod = 'GET' | 'PUT' | 'POST' | 'PATCH' | 'DELETE';

/**
 * All data types that column can be.
 */
export class RestMethods {
  public static GET: RestMethod = 'GET';
  public static PUT: RestMethod = 'PUT';
  public static POST: RestMethod = 'POST';
  public static PATCH: RestMethod = 'PATCH';
  public static DELETE: RestMethod = 'DELETE';
}

/**
 * options for for communication with the external print service
 *
 * @export
 * @interface IPrintServiceOptions
 */
export interface IPrintServiceOptions {
  /**
   * Hostname
   *
   * @type {string}
   * @memberof IPrintServiceOptions
   */
  host: string;

  /**
   * Port
   *
   * @type {number}
   * @memberof IPrintServiceOptions
   */
  port: number;


  /**
   * Konfiguration von Zertifikaten etc.
   */
  agentOptions: {

    /**
     * Pfad auf die Zertifikatdatei (relativ oder absolut)
     *
     * @type {string}
     */
    certPath: string;

    /**
     * Pfad auf die Datei mit private Key (relativ oder absolut)
     *
     * @type {string}
     */
    keyPath: string;

    /**
     * Pfad auf die Datei mit ca Key (relativ oder absolut)
     *
     * @type {string}
     */
    caPath: string;

    /**
     * TODO
     *
     * @type {boolean}
     * @memberof IPrintServiceOptions
     */
    rejectUnauthorized: boolean;
  };
}