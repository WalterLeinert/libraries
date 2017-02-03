import path = require('path');
import fs = require('fs');
import * as Express from 'express';
import { ServerLoader } from 'ts-express-decorators';
import { Forbidden } from 'ts-httpexceptions';
import { $log } from 'ts-log-debug';

// Fluxgate
import {
    AppConfig, Assert, FileSystem, fromEnvironment,
    IAppConfig, JsonReader, LoggingConfiguration, StringBuilder
} from '@fluxgate/common';

// lokale Komponenten
import { Messages } from '../resources/messages';
import { Logging } from './util';

// -------------------------- logging -------------------------------
import { using, XLog } from 'enter-exit-logger';
import { configure, getLogger, levels, Logger } from 'log4js';

// Logging konfigurieren ...
Logging.configureLogging('@fluxgate/server', fromEnvironment('NODE_ENV', 'development'));

// -------------------------- logging -------------------------------


const appConfigPath = path.join(process.cwd(), 'app/config/config.json');
const appConfig = JsonReader.readJsonSync<IAppConfig>(appConfigPath);
AppConfig.register(appConfig);



/**
 * Konfiguration des Server v.a. für Https
 * 
 * @export
 * @interface IServerConfiguration
 */
export interface IServerConfiguration {

    /**
     * Pfad auf die Zertifikatdatei
     * 
     * @type {string}
     * @memberOf IServerConfiguration
     */
    certPath: string;

    /**
     * Pfad auf die Datei mit private Key
     * 
     * @type {string}
     * @memberOf IServerConfiguration
     */
    keyPath: string;
}


/**
 * Spezielle Einstellungen für den Express Webserver
 * 
 * @export
 * @interface IExpressConfiguration
 */
export interface IExpressConfiguration {

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
    port?: number;

    /**
     * der Https-Port
     * @example 8080
     */
    httpsPort?: number;


    /**
     * Pfad auf die Zertifikatdatei
     * 
     * @type {string}
     * @memberOf IExpressConfiguration
     */
    certPath?: string;

    /**
     * Pfad auf die Datei mit private Key
     * 
     * @type {string}
     * @memberOf IExpressConfiguration
     */
    keyPath?: string;
}



/**
 * Basisklasse für Express-Server aus Basis von ts-express-decorators (@see ServerLoader)
 * 
 * @export
 * @class ServerBase
 * @extends {ServerLoader}
 */
export abstract class ServerBase extends ServerLoader {
    protected static logger = getLogger('ServerBase');

    /**
     * Default Express-Konfiguration
     */
    public static readonly DEFAULT_EXPRESS_CONFIGURATION: IExpressConfiguration = {
        endPoint: '/rest',
        controllers: 'controllers/**/*.js',
        port: 8000,
        httpsPort: 8080
    };


    /**
     * In your constructor set the global endpoint and configure the folder to scan the controllers.
     * You can start the http and https server.
     */
    protected constructor(private configuration: IExpressConfiguration) {
        super();

        using(new XLog(ServerBase.logger, levels.INFO, 'ctor'), (log) => {
            Assert.notNull(configuration);

            if (!configuration) {
                configuration = ServerBase.DEFAULT_EXPRESS_CONFIGURATION;  // TODO: clone
            }

            this.configure(this.configuration);
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

                const serverControllers = path.join(cwd, '../../node_modules/@fluxgate/server/dist/*.js');

                let controllers = this.configuration.controllers;
                if (!path.isAbsolute(this.configuration.controllers)) {
                    controllers = path.join(cwd, this.configuration.controllers);
                }

                log.info(`__dirname = ${__dirname}, controllers = ${controllers}`);

                const errorLogger = (message: string): void => {
                    log.error(message);
                };

                const cert = FileSystem.readTextFile(errorLogger, this.configuration.certPath, 'Zertifikat');
                const key = FileSystem.readTextFile(errorLogger, this.configuration.keyPath, 'Private Key');


                this.setEndpoint(this.configuration.endPoint)
                    .scan(serverControllers)
                    .scan(controllers)
                    .createHttpServer(this.configuration.port)
                    .createHttpsServer({
                        port: this.configuration.httpsPort,
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
     * 
     */
    public onError(error: any, request: Express.Request, response: Express.Response, next: Express.NextFunction): any {
        using(new XLog(ServerBase.logger, levels.INFO, 'onError'), (log) => {
            if (error instanceof Forbidden) {
                error.message = Messages.AUTHENTICATION_REQUIRED();
            }
            const rval = super.onError(error, request, response, next);

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
            return rval;
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
     * 
     */
    private configure(configuration: IExpressConfiguration) {
        using(new XLog(ServerBase.logger, levels.DEBUG, 'configure'), (log) => {

            if (!configuration.endPoint) {
                configuration.endPoint = ServerBase.DEFAULT_EXPRESS_CONFIGURATION.endPoint;
            }

            if (!configuration.controllers) {
                configuration.controllers = ServerBase.DEFAULT_EXPRESS_CONFIGURATION.controllers;
            }

            if (!configuration.port) {
                configuration.port = ServerBase.DEFAULT_EXPRESS_CONFIGURATION.port;
            }

            if (!configuration.httpsPort) {
                configuration.httpsPort = ServerBase.DEFAULT_EXPRESS_CONFIGURATION.httpsPort;
            }
        });
    }



}