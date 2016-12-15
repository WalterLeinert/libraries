import path = require('path');
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

@Injectable()
export class ConfigService {
  config: IAppConfig;

  constructor() {
    //this.config = <IAppConfig>require('./config/config.json');
    //TODO: hart verdrahtet!!
    this.config = <IAppConfig>{
      url: "http://localhost:8000/rest/",
      mode: "development"
    };
  }
}