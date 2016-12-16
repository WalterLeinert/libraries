import path = require('path');
import * as Express from 'express';
import { ServerLoader } from 'ts-express-decorators';
import { Forbidden } from 'ts-httpexceptions';

// Fluxgate
import { Assert, StringBuilder } from '@fluxgate/common';
import { KnexService, UserService, RoleService } from './services';

// lokale Komponenten
import { Messages } from '../resources/messages';

// -------------------------- logging -------------------------------
import { Logger, levels, /* configure, */ getLogger } from 'log4js';
import { XLog, using } from 'enter-exit-logger';

// configure('config/log4js.json');
// configure(Path.dirname(process.argv[1]).concat('/config/log4js.json'));
// -------------------------- logging -------------------------------


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
}



/**
 * Basisklasse für Express-Server aus Basis von ts-express-decorators (@see ServerLoader)
 * 
 * @export
 * @class ServerBase
 * @extends {ServerLoader}
 */
export abstract class ServerBase extends ServerLoader {
    static logger = getLogger('ServerBase');

    /**
     * Default Express-Konfiguration
     */
    public static readonly DEFAULT_EXPRESS_CONFIGURATION: IExpressConfiguration = {
        endPoint: '/rest',
        controllers: 'controllers/**/*.js',
        port: 8000,
        httpsPort: 8080
    }

    /**
     * Initialisierung und Start
     * 
     * @returns {Promise<U>|Promise<TResult>}
     */
    public Initialize(): Promise<ServerBase> {
        let server: Promise<any> = undefined;

        return using(new XLog(ServerBase.logger, levels.INFO, 'Initialize'), (log) => {

            return new Promise<ServerBase>((resolve, reject) => {
                let cwd = process.cwd();
                log.info(`cwd = ${cwd}`);

                let controllers = this.configuration.controllers;
                if (!path.isAbsolute(this.configuration.controllers)) {
                    controllers = path.join(cwd, this.configuration.controllers);
                }

                log.info(`controllers = ${controllers}`);

                this.setEndpoint(this.configuration.endPoint)
                    .scan(controllers)
                    .createHttpServer(this.configuration.port)
                    .createHttpsServer({
                        port: this.configuration.httpsPort
                    });


                this.start()
                    .then(() => {
                        log.info('Server started...');
                        resolve(this);
                    })
                    .catch(err => {
                        log.error(err);
                        reject(err);
                    })
            });
        });
    }


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
            } else {
                this.configure(this.configuration);
            }
        });
    }

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


    /**
     * 
     */
    public onError(error: any, request: Express.Request, response: Express.Response, next: Express.NextFunction): any {
        using(new XLog(ServerBase.logger, levels.INFO, 'onError'), (log) => {
            if (error instanceof Forbidden) {
                error.message = Messages.AUTHENTICATION_REQUIRED();
            }
            let rval = super.onError(error, request, response, next);

            let sb = new StringBuilder();
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
                // Just use passport strategy method to know if the user is Authenticated :)
                return request.isAuthenticated();
            });
    };

}