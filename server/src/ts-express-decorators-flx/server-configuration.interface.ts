import * as Knex from 'knex';

import { IPrintServiceOptions } from './services/print/print-service-options.interface';

/**
 * Konfiguration des Server v.a. für Https
 *
 * @export
 * @interface IServerConfiguration
 */
export interface IServerConfiguration {

  /**
   * Name des virtuellen Datenverzeichnisses (default: /data)
   */
  dataName?: string;

  /**
   * Pfad auf physikalisches Datenverzeichnis, auf welches dataName gemountet ist
   */
  dataDirectory?: string;

  /**
   * erlaubte MIME encodings
   *
   * @type {string[]}
   */
  acceptMimes: string[];


  /**
   * Konfiguration von Zertifikaten
   */
  cert?: {

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
  };


  /**
   * Konfiguration von express.js
   */
  express: {

    /**
     * der Endpoint des Rest-API
     * @example '/rest'
     */
    endPoint?: string;

    /**
     * der Http-Port
     * @example 8000
     */
    port: number;

    /**
     * der Https-Port
     * @example 8080
     */
    httpsPort: number;
  };


  /**
   * Konfiguration von eines Mailservers
   */
  mail: {
    host: string;
    port: number;
    ssl: boolean;
    user: string;
    password: string;
    from: string;
  };

  /**
   * Konfiguration für das Drucken
   */
  print: IPrintServiceOptions;

  /**
   * Konfiguration für Knex
   */
  knex: Knex.Config;
}