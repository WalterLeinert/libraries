// Angular
import { Injectable } from '@angular/core';

// -------------------------- logging -------------------------------
// import { Logger, levels, getLogger } from 'log4js';
// import { XLog, using } from 'enter-exit-logger';
// -------------------------- logging -------------------------------

// Fluxgate
import { AppConfig, IAppConfig } from '@fluxgate/common';


@Injectable()
export class AppConfigService {

  /**
   * Liefert die Anwendungskonfiguration
   */
  public get config(): IAppConfig {
    return AppConfig.config;
  }
}