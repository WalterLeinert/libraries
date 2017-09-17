export type RestMethod = 'GET' | 'PUT' | 'POST' | 'PATCH' | 'DELETE';

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
   * relative REST-Path
   *
   * @type {string}
   * @memberof IPrintServiceOptions
   */
  path: string;

  /**
   * Port
   *
   * @type {number}
   * @memberof IPrintServiceOptions
   */
  port: number;

  /**
   * REST method (e.g. 'POST')
   *
   * @type {string}
   * @memberof IPrintServiceOptions
   */
  method: RestMethod;

  /**
   * TODO
   *
   * @type {boolean}
   * @memberof IPrintServiceOptions
   */
  json: boolean;

  /**
   * TODO
   *
   * @type {boolean}
   * @memberof IPrintServiceOptions
   */
  rejectUnauthorized: boolean;

  /**
   * TODO
   *
   * @type {boolean}
   * @memberof IPrintServiceOptions
   */
  requestCert: boolean;
}