// tslint:disable:interface-name

import * as Express from 'express';
import * as Knex from 'knex';
import * as path from 'path';


import { IServerLifecycle } from 'ts-express-decorators';

// tslint:disable-next-line:no-empty-interface
export interface ServerLoader extends IServerLifecycle {

}

import { ServerLoader } from 'ts-express-decorators';


import { Forbidden } from 'ts-httpexceptions';

// -------------------------- logging -------------------------------
// tslint:disable-next-line:no-unused-variable
import { getLogger, ILogger, levels, using, XLog } from '@fluxgate/platform';
// -------------------------- logging -------------------------------


// Fluxgate
import { AppConfig } from '@fluxgate/common';
import { Assert, Clone, ConfigurationException, Core, StringBuilder, Types, Utility } from '@fluxgate/core';
import { FileSystem } from '@fluxgate/node';


// lokale Komponenten
import { Messages } from '../resources/messages';
import { GlobalAcceptMimesMiddleware } from './middlewares/global-accept-mimes-middleware';
import { IServerConfiguration } from './server-configuration.interface';
import { KnexService } from './services/knex.service';





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
    dataName: '/data',
    acceptMimes: ['application/json'],
    express: {
      endPoint: '/rest',
      port: 8000,
      httpsPort: 8080
    },
    mail: {
      host: 'smtpserver',
      port: 25,
      ssl: true,
      user: 'username',
      password: 'password',
      from: 'from'
    },
    print: null,
    knex: undefined
  };


  /**
   * In your constructor set the global endpoint and configure the folder to scan the controllers.
   * You can start the http and https server.
   */
  protected constructor(protected rootDir: string, protected configuration: IServerConfiguration) {
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
        const rootDir = path.resolve(__dirname);
        log.info(`rootDir = ${rootDir}`);

        // interne Controller (wie UserController)
        const serverControllers = path.join(rootDir, './**/controllers/*.js');

        const errorLogger = (message: string): void => {
          log.error(message);
        };

        const cert = FileSystem.readTextFile(errorLogger, this.configuration.cert.certPath, 'Zertifikat');
        const key = FileSystem.readTextFile(errorLogger, this.configuration.cert.keyPath, 'Private Key');


        this.mount(this.configuration.express.endPoint, serverControllers)
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
        .use(GlobalAcceptMimesMiddleware)
        .use(morgan('dev'))

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


  public $onAuth(request: Express.Request, response: Express.Response, next: Express.NextFunction,
    authorization?: any): boolean | void {
    using(new XLog(ServerBase.logger, levels.DEBUG, '$onAuth',
      `authorization = ${Core.stringify(authorization)}`), (log) => {

        //
        // TODO: AppConfig.config.userCredentials auswerten
        //
        if (AppConfig.config.mode === 'development' && AppConfig.config.userCredentials) {
          next(true);
        } else {

          // Just use passport strategy method to know if the user is Authenticated :)
          next(request.isAuthenticated());
        }
      });
  }


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

      if (log.isDebugEnabled()) {
        const knexConfig = Clone.clone(configuration.knex);
        // tslint:disable-next-line:no-string-literal
        knexConfig.connection['password'] = '*****';
        log.debug('Knex.config = ', knexConfig);
      }


      const cwd = process.cwd();
      log.info(`cwd = ${cwd}`);

      //
      // acceptMimes
      //
      if (!Types.isPresent(configuration.acceptMimes)) {
        configuration.acceptMimes = [...ServerBase.DEFAULT_SERVER_CONFIGURATION.acceptMimes];
      }

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
          configuration.cert.certPath = path.join(this.rootDir, 'config', configuration.cert.certPath);
        }
        if (!path.isAbsolute(configuration.cert.keyPath)) {
          configuration.cert.keyPath = path.join(this.rootDir, 'config', configuration.cert.keyPath);
        }
      }

      if (!path.isAbsolute(configuration.print.agentOptions.certPath)) {
        configuration.print.agentOptions.certPath = path.join(this.rootDir, 'config',
          configuration.print.agentOptions.certPath);
      }

      if (!path.isAbsolute(configuration.print.agentOptions.keyPath)) {
        configuration.print.agentOptions.keyPath = path.join(this.rootDir, 'config',
          configuration.print.agentOptions.keyPath);
      }

      if (!path.isAbsolute(configuration.print.agentOptions.caPath)) {
        configuration.print.agentOptions.caPath = path.join(this.rootDir, 'config',
          configuration.print.agentOptions.caPath);
      }
    });
  }

}