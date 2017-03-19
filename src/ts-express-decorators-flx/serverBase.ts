import path = require('path');
import * as Express from 'express';
import * as Knex from 'knex';
import { ServerLoader } from 'ts-express-decorators';
import { Forbidden } from 'ts-httpexceptions';

// -------------------------- logging -------------------------------
// tslint:disable-next-line:no-unused-variable
import { getLogger, ILogger, levels, using, XLog } from '@fluxgate/common';
// -------------------------- logging -------------------------------


// Fluxgate
import {
  AppConfig, Assert, ConfigurationException, FileSystem, fromEnvironment, StringBuilder, Types, Utility
} from '@fluxgate/common';


// lokale Komponenten
import { Messages } from '../resources/messages';
import { KnexService } from './services/knex.service';
import { Logging } from './util';


// Logging konfigurieren ...
Logging.configureLogging('@fluxgate/server', fromEnvironment('NODE_ENV', 'development'));


/**
 * Konfiguration des Server v.a. für Https
 * 
 * @export
 * @interface IServerConfiguration
 */
export interface IServerConfiguration {

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
     * Path-Pattern für die Controller-Klassen
     * @example '/controllers/xx/x.js' (x steht für *)
     */
    controllers?: string;

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

  knex: Knex.Config;
}



/**
 * Basisklasse für Express-Server aus Basis von ts-express-decorators (@see ServerLoader)
 * 
 * @export
 * @class ServerBase
 * @extends {ServerLoader}
 */
export abstract class ServerBase extends ServerLoader {
  protected static logger = getLogger(ServerBase);

  /**
   * Default Express-Konfiguration
   */
  public static readonly DEFAULT_SERVER_CONFIGURATION: IServerConfiguration = {
    express: {
      endPoint: '/rest',
      controllers: './controllers/**/*.js',
      port: 8000,
      httpsPort: 8080
    },
    knex: undefined
  };


  /**
   * In your constructor set the global endpoint and configure the folder to scan the controllers.
   * You can start the http and https server.
   */
  protected constructor(private configuration: IServerConfiguration) {
    super();

    using(new XLog(ServerBase.logger, levels.INFO, 'ctor'), (log) => {
      Assert.notNull(configuration);
      this.configure(configuration);
    });
  }


  /**
   * Initialisierung und Start
   * 
   * @returns {Promise<U>|Promise<TResult>}
   */
  public Initialize(): Promise<ServerBase> {
    return using(new XLog(ServerBase.logger, levels.INFO, 'Initialize'), (log) => {

      return new Promise<ServerBase>((resolve, reject) => {
        const cwd = process.cwd();
        log.info(`cwd = ${cwd}`);

        // interne Controller (wie UserController)
        const serverControllers = path.join(cwd, '../../node_modules/@fluxgate/server/dist/*.js');

        // Anwendungscontroller
        const controllers = this.configuration.express.controllers;
   
        log.info(`__dirname = ${__dirname}, controllers = ${controllers}`);

        const errorLogger = (message: string): void => {
          log.error(message);
        };

        const cert = FileSystem.readTextFile(errorLogger, this.configuration.cert.certPath, 'Zertifikat');
        const key = FileSystem.readTextFile(errorLogger, this.configuration.cert.keyPath, 'Private Key');


        this.setEndpoint(this.configuration.express.endPoint)
          .scan(serverControllers)
          .scan(controllers)
          .createHttpServer(this.configuration.express.port)
          .createHttpsServer({
            port: this.configuration.express.httpsPort,
            cert: cert,
            key: key
          });


        this.start()
          .then(() => {
            log.info('Server started...');
            resolve(this);
          })
          .catch((err) => {
            log.error(err);
            reject(err);
          });
      });
    });
  }



  /**
   * This method let you configure the middleware required by your application to works.  
   * @returns {Server}
   */
  public $onMountingMiddlewares(): void | Promise<any> {
    return using(new XLog(ServerBase.logger, levels.INFO, '$onMountingMiddlewares'), (log) => {
      const morgan = require('morgan');
      const cookieParser = require('cookie-parser');
      const bodyParser = require('body-parser');
      const compress = require('compression');
      const methodOverride = require('method-override');

      this
        .use(morgan('dev'))
        .use(ServerLoader.AcceptMime('application/json'))

        .use(cookieParser())
        .use(compress({}))
        .use(methodOverride())
        .use(bodyParser.json())
        .use(bodyParser.urlencoded({
          extended: true
        }));

      return null;
    });
  }


  /**
   * 
   */
  public $onError(error: any, request: Express.Request, response: Express.Response, next: Express.NextFunction): void {
    using(new XLog(ServerBase.logger, levels.INFO, 'onError'), (log) => {
      if (error instanceof Forbidden) {
        error.message = Messages.AUTHENTICATION_REQUIRED();
      }
      // const rval = super.onError(error, request, response, next);

      const sb = new StringBuilder();
      if (error.code) {
        sb.appendLine(`code: ${error.code}`);
      }
      if (error.errno) {
        sb.appendLine(`errno: ${error.errno}`);
      }
      if (error.index) {
        sb.appendLine(`index: ${error.index}`);
      }
      if (error.message) {
        sb.appendLine(`message: ${error.message}`);
      }
      if (error.sqlState) {
        sb.appendLine(`sqlState: ${error.sqlState}`);
      }
      if (error.stack) {
        sb.appendLine(`stack: ${error.stack}`);
      }
      log.error(sb.toString());

      next(error);
    });
  }


  public isAuthenticated(request: Express.Request, response: Express.Response, next?: Express.NextFunction,
    authorization?: any): boolean {
    return using(new XLog(ServerBase.logger, levels.DEBUG,
      `isAuthenticated: authorization = ${JSON.stringify(authorization)}`), (log) => {

        //
        // TODO: AppConfig.config.userCredentials auswerten
        //
        if (AppConfig.config.mode === 'development' && AppConfig.config.userCredentials) {
          return true;
        }

        // Just use passport strategy method to know if the user is Authenticated :)
        return request.isAuthenticated();
      });
  };


  /**
   * Konsolidiert/prüft die Konfiguration
   */
  private configure(configuration: IServerConfiguration) {
    using(new XLog(ServerBase.logger, levels.INFO, 'ctor'), (log) => {
      Assert.notNull(configuration);

      if (!Types.isPresent(configuration.express)) {
        throw new ConfigurationException('Express configuration required.');
      }

      if (!Types.isPresent(configuration.knex)) {
        throw new ConfigurationException('Knex configuration required.');
      }

      KnexService.configure(configuration.knex);
      log.debug('Knex.config = ', configuration.knex);

      const cwd = process.cwd();
      log.info(`cwd = ${cwd}`);


      //
      // Controllers
      //
      if (Utility.isNullOrEmpty(configuration.express.controllers)) {
        configuration.express.controllers = ServerBase.DEFAULT_SERVER_CONFIGURATION.express.controllers;
      }

      if (!path.isAbsolute(configuration.express.controllers)) {
        configuration.express.controllers  = path.join(cwd, this.configuration.express.controllers);
      }
      // if (configuration.express.controllers.startsWith('.')) {
      //   configuration.express.controllers = path.join(process.cwd(), 'config', configuration.express.controllers);
      // }

      //
      // Endpoint
      //
      if (Utility.isNullOrEmpty(configuration.express.endPoint)) {
        configuration.express.endPoint = ServerBase.DEFAULT_SERVER_CONFIGURATION.express.endPoint;
      }


      //
      // Ports
      // 
      if (!(Types.isPresent(configuration.express.port) || Types.isPresent(configuration.express.httpsPort))) {
        throw new ConfigurationException('At least one port must be configured.');
      }


      //
      // Zertifikate
      //
      if (configuration.cert) {
        if (Utility.isNullOrEmpty(configuration.cert.certPath)) {
          throw new ConfigurationException('Path to certificate required');
        }
        if (Utility.isNullOrEmpty(configuration.cert.keyPath)) {
          throw new ConfigurationException('Path to private key required');
        }

        if (!path.isAbsolute(configuration.cert.certPath)) {
          configuration.cert.certPath = path.join(process.cwd(), 'config', configuration.cert.certPath);
        }
        if (!path.isAbsolute(configuration.cert.keyPath)) {
          configuration.cert.keyPath = path.join(process.cwd(), 'config', configuration.cert.keyPath);
        }
      }
    });
  }

}