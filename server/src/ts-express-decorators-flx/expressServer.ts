import * as Express from 'express';
import * as path from 'path';
import { ServerSettings } from 'ts-express-decorators';


// -------------------------- logging -------------------------------
// tslint:disable-next-line:no-unused-variable
import { getLogger, ILogger, levels, using, XLog } from '@fluxgate/common';
// -------------------------- logging -------------------------------

// Fluxgate
import { AppConfig, IAppConfig, JsonReader } from '@fluxgate/common';

import { GlobalErrorHandler } from './middlewares/globalErrorHandler';
import { ServerBase } from './serverBase';
import { IServerConfiguration } from './serverBase';


const appConfigPath = path.join(process.cwd(), 'app/config/config.json');
const appConfig = JsonReader.readJsonSync<IAppConfig>(appConfigPath);
AppConfig.register(appConfig);

// Server-Rootdir (zur Laufzeit)
const rootDir = path.join(process.cwd());

/**
 * Standardimplementierung für den Express-Server
 *
 * @export
 * @class ExpressServer
 * @extends {ServerBase}
 */

@ServerSettings({

  rootDir: rootDir,
  mount: {
    '/rest': `${rootDir}/controllers/**/**.js`
  },
  componentsScan: [
    `${rootDir}/services/**/**.js`,
    `${rootDir}/middlewares/**/**.js`
  ],
  acceptMimes: ['application/json']  // add your custom configuration here
})
export class ExpressServer extends ServerBase {
  protected static logger = getLogger(ExpressServer);

  public constructor(configuration: IServerConfiguration) {
    super(configuration);
  }

  public $afterRoutesInit() {
    this.use(GlobalErrorHandler);
  }


  /**
   * Zusätzliche Middleware konfigurieren
   *
   * @returns {(void | Promise<any>)}
   *
   * @memberOf ExpressServer
   */
  public $onMountingMiddlewares(): void | Promise<any> {
    return using(new XLog(ExpressServer.logger, levels.INFO, '$onMountingMiddlewares'), (log) => {

      super.$onMountingMiddlewares();

      const session = require('express-session');
      const cors = require('cors');
      const passport = require('passport');

      this
        // configure session used by passport
        .use(session({
          cookie: {
            httpOnly: true,
            maxAge: null,
            path: '/',
            secure: false
          },
          maxAge: 36000,            // TODO: ggf. aus IServerConfiguration
          resave: true,
          saveUninitialized: true,
          secret: 'mysecretkey'
        }))
        .use(cors({ origin: '*' }))

        .use(Express.static(path.join(process.cwd(), '/app'), { index: ['index.html', 'index.htm'] }));

      // Configure passport JS
      this
        .use(passport.initialize())
        .use(passport.session());

      return null;
    });
  }
}