import { Injectable } from '@angular/core';

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
  public static readonly APP_CONFIG_KEY = 'IAppConfig';
  
  private _config: IAppConfig;

  constructor() {
    this._config = AppRegistry.instance.get<IAppConfig>(ConfigService.APP_CONFIG_KEY);
  }

  /**
   * Liefert die Anwendungskonfiguration
   */
  public get config(): IAppConfig {
    return this._config;
  }
}