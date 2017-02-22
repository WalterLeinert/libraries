// -------------------------- logging -------------------------------
import { IConfig } from '../diagnostics/config.interface';
import { getLogger } from '../diagnostics/logger';
// tslint:disable-next-line:no-unused-variable
import { ILogger } from '../diagnostics/logger.interface';
// -------------------------- logging -------------------------------

// Fluxgate
import { AppRegistry } from '../base';


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

export interface IUserCredentials {
  username: string;
  password: string;
}

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

  /**
   * zum Testen mit SystemMode == 'development': ist @see{userCredentials} gesetzt,
   * wird versucht damit ein automatisches Login durchzuführen.
   */
  userCredentials?: IUserCredentials;

  logging?: IConfig;
}


export class AppConfig {
  protected static logger = getLogger('ConfigService');
  public static readonly APP_CONFIG_KEY = 'IAppConfig';

  public static register(config: IAppConfig) {
    const key = AppConfig.APP_CONFIG_KEY;
    AppRegistry.instance.add<IAppConfig>(key, config);

    AppConfig.logger.info(`configured: key = ${key} -> ${JSON.stringify(config)}`);
  }

  /**
   * Liefert die Anwendungskonfiguration
   */
  public static get config(): IAppConfig {
    return AppRegistry.instance.get<IAppConfig>(AppConfig.APP_CONFIG_KEY);
  }
}