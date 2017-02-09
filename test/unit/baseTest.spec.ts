import path = require('path');
// tslint:disable-next-line:no-var-requires
require('reflect-metadata');

// -------------------------- logging -------------------------------
import {
    configure, getLogger, ILogger, levels, Logger, using, XLog
} from '@fluxgate/common';
// -------------------------- logging -------------------------------


import { fromEnvironment } from '@fluxgate/common';


/**
 * Basisklasse für alle Unit-Tests
 */
export abstract class BaseTest {
    protected static readonly logger = getLogger('BaseTest');


    /**
     * wird einmal vor allen Tests ausgeführt
     */
    protected static before() {
        using(new XLog(BaseTest.logger, levels.DEBUG, 'static.before'), (log) => {
            BaseTest.initializeLogging();
        });
    }


    protected static after() {
        // tslint:disable-next-line:no-empty
        using(new XLog(BaseTest.logger, levels.DEBUG, 'static.after'), (log) => {
        });
    }


    private static initializeLogging() {
        using(new XLog(BaseTest.logger, levels.DEBUG, 'initializeLogging'), (log) => {
            // Logging konfigurieren ...
            const systemMode = fromEnvironment('NODE_ENV', 'development');

            if (systemMode) {
                const configFile = 'log4js.' + systemMode + '.json';
                let configPath = path.join('/test/config', configFile);
                configPath = path.join(process.cwd(), configPath);
                log.log(`logging: systemMode = ${systemMode}, module = ${path.basename(__filename)},` +
                    `configPath = ${configPath}`);

                configure(configPath);
            } else {
                log.warn(`logging: no systemMode defined -> not reading configuration`);
            }
        });
    }


    protected before() {
        // tslint:disable-next-line:no-empty
        using(new XLog(BaseTest.logger, levels.DEBUG, 'before'), (log) => {
        });
    }

    protected after() {
        // tslint:disable-next-line:no-empty
        using(new XLog(BaseTest.logger, levels.DEBUG, 'after'), (log) => {
        });
    }

}