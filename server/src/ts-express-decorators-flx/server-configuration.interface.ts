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


  cert?: {

    /**
     * Pfad auf die Zertifikatdatei (relativ oder absolut)
     *
     * @type {string}
     * @memberOf IServerConfiguration
     */
    certPath: string;

    /**
     * Pfad auf die Datei mit private Key (relativ oder absolut)
     *
     * @type {string}
     * @memberOf IServerConfiguration
     */
    keyPath: string;
  };


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

  mail: {
    host: string;
    port: number;
    ssl: boolean;
    user: string;
    password: string;
    from: string;
  };

  print: IPrintServiceOptions;

  knex: Knex.Config;
}