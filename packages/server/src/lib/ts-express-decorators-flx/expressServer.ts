import * as Express from 'express';
import * as path from 'path';
import { InjectorService, ServerSettings } from 'ts-express-decorators';

// -------------------------------------- logging --------------------------------------------
// tslint:disable-next-line:no-unused-variable
import { getLogger, ILogger, levels, using, XLog } from '@fluxgate/platform';
// -------------------------------------- logging --------------------------------------------


// Fluxgate
import { AppConfig, IAppConfig } from '@fluxgate/common';
import { Assert, ServerSystemException, Types } from '@fluxgate/core';
import { FileSystem, JsonReader } from '@fluxgate/node';

import { GlobalErrorHandler } from './middlewares/global-error-handler';
// import {
//   GlobalSerializationRequestHandler, GlobalSerializationResponsetHandler
// } from './middlewares/global-serialization-handler';

import { IServerConfiguration } from './server-configuration.interface';
import { ServerBase } from './serverBase';
import { ServerConfigurationService } from './services/server-configuration.service';


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
  debug: true,

  rootDir: rootDir,
  mount: {
    '/rest': `${rootDir}/controllers/**/*.js`
  },
  componentsScan: [
    `${rootDir}/services/**/*.js`,
    `${rootDir}/middlewares/**/*.js`
  ],
  acceptMimes: ['application/json']  // add your custom configuration here
})
export class ExpressServer extends ServerBase {
  protected static logger = getLogger(ExpressServer);

  public constructor(configuration: IServerConfiguration) {
    super(configuration);
    // this.settings.set('debug', true);
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

      //
      // Hinweis: der ServerConfigurationService ist erst hier verfügbar, da erst in ServerLoader.initializeSettings
      // die Services mittels InjectorService.load(); geladen wurden.
      //
      const configurationService: ServerConfigurationService =
        InjectorService.get<ServerConfigurationService>(ServerConfigurationService);
      configurationService.register(this.configuration);


      super.$onMountingMiddlewares();

      const session = require('express-session');
      const cors = require('cors');
      const passport = require('passport');

      let dataName = ServerBase.DEFAULT_SERVER_CONFIGURATION.dataName;
      if (!Types.isNullOrEmpty(this.configuration.dataName)) {
        dataName = this.configuration.dataName;
      }
      log.log(`dataName = ${dataName}`);

      Assert.notNullOrEmpty(this.configuration.dataDirectory, `no dataDirectory configured.`);
      if (!FileSystem.directoryExists(this.configuration.dataDirectory)) {
        throw new ServerSystemException(`Directory ${this.configuration.dataDirectory} does not exists.`);
      }

      let dataDirectory = this.configuration.dataDirectory;
      if (!path.isAbsolute(dataDirectory)) {
        dataDirectory = path.join(process.cwd(), dataDirectory);
      }
      log.log(`dataDirectory = ${dataDirectory}`);


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

        .use(Express.static(path.join(process.cwd(), '/app'), { index: ['index.html', 'index.htm'] }))
        .use(dataName, Express.static(dataDirectory));

      // Configure passport JS
      this
        .use(passport.initialize())
        .use(passport.session());

      // this
      //   .use(GlobalSerializationRequestHandler);
      // .use(GlobalSerializationResponsetHandler);
      return null;
    });
  }
}