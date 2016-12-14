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
 * TODO: geht so nicht mit Konstruktor-Parameter wegen DI!!
 * 
 * @export
 * @class __todo_ConfigService
 */
@Injectable()
export class __todo_ConfigService  {
  config: IAppConfig;

  /**
   * Creates an instance of ConfigService.
   * 
   * 
   * @param {string} configPath - Pfad auf Json-Konfigurationsdatei
   * 
   * @memberOf ConfigService
   */
  constructor(configPath: string = './config/config.json') {
    this.config = <IAppConfig>require(configPath);
    // console.log('app is running in mode %s, url = %s', this.config.mode, this.config.url);
  }
}