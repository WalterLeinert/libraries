// Angular
import { Injectable } from '@angular/core';

// -------------------------- logging -------------------------------
// import { Logger, levels, getLogger } from 'log4js';
// import { XLog, using } from 'enter-exit-logger';
// -------------------------- logging -------------------------------

// Fluxgate
import { AppRegistry } from '@fluxgate/common';


/**
 * 
 */
export type SystemMode =

  /**
   * Entwicklung (lokaler Testserver)
   */
  'local' |

  /**
   * Entwicklung (remote Testserver, ggf. in Docker)
   */
  'development' |

  /**
   * Produktion
   */
  'production'
  ;


/**
 * Interface für Applikationskonfiguration
 * 
 * @export
 * @interface IAppConfig
 */
export interface IAppConfig {

  /**
   * Basis-Url des Servers (REST-Api)
   * 
   * @type {string}
   * @memberOf IAppConfig
   */
  url: string;

  /**
   * Der Modus, in dem das komplette System läuft (Client + Server)
   * 
   * @type {RunMode}
   * @memberOf IAppConfig
   */
  mode: SystemMode;
}


@Injectable()
export class ConfigService {
  // static logger = getLogger('ConfigService');
  public static readonly APP_CONFIG_KEY = 'IAppConfig';

  private _config: IAppConfig;

  constructor() {
    // using(new XLog(ConfigService.logger, levels.INFO, 'ctor'), (log) => {
      let key = ConfigService.APP_CONFIG_KEY;   
      this._config = AppRegistry.instance.get<IAppConfig>(key);
      console.info(`configured: key = ${key} -> ${JSON.stringify(this._config)}`);
    // });
  }

  /**
   * Liefert die Anwendungskonfiguration
   */
  public get config(): IAppConfig {
    return this._config;
  }
}