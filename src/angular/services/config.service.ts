import { Injectable } from '@angular/core';


/**
 * 
 */
export type SystemMode =
  'development' |
  'production';



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


/**
 * 
 * @export
 * @class __todo_ConfigService
 */
@Injectable()
export class ConfigService  {
  public static readonly CONFIG_PATH = './config/config.json';

  config: IAppConfig;

  /**
   * Creates an instance of ConfigService.
   * 
   * 
   * @param {string} configPath - Pfad auf Json-Konfigurationsdatei
   * 
   * @memberOf ConfigService
   */
  constructor() {
    this.config = <IAppConfig>require(ConfigService.CONFIG_PATH);
    // console.log('app is running in mode %s, url = %s', this.config.mode, this.config.url);
  }
}