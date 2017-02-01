let path = require('path');
require('reflect-metadata');

// -------------------------- logging -------------------------------
import { Logger, levels, getLogger, configure } from 'log4js';
import { XLog, using } from 'enter-exit-logger';
// -------------------------- logging -------------------------------


import { fromEnvironment } from '@fluxgate/common';


/**
 * Basisklasse für alle Unit-Tests
 */
export abstract class BaseTest {
    static readonly logger = getLogger('BaseTest');


    /**
     * wird einmal vor allen Tests ausgeführt
     */
    protected static before() {
        using(new XLog(BaseTest.logger, levels.DEBUG, 'static.before'), (log) => {
            BaseTest.initializeLogging();
        });
    }


    protected static after() {
        using(new XLog(BaseTest.logger, levels.DEBUG, 'static.after'), (log) => {
        });
    }


    private static initializeLogging() {
        using(new XLog(BaseTest.logger, levels.DEBUG, 'initializeLogging'), (log) => {
            // Logging konfigurieren ...
            let systemMode = fromEnvironment('NODE_ENV', 'development');

            if (systemMode) {
                let configFile = 'log4js.' + systemMode + '.json';
                let configPath = path.join('/test/config', configFile);
                configPath = path.join(process.cwd(), configPath);
                log.log(`log4js: systemMode = ${systemMode}, module = ${path.basename(__filename)}, configPath = ${configPath}`);

                configure(configPath);
            } else {
                log.warn(`log4js: no systemMode defined -> not reading configuration`)
            }
        });
    }


    protected before() {
        using(new XLog(BaseTest.logger, levels.DEBUG, 'before'), (log) => {
        });
    }

    protected after() {
        using(new XLog(BaseTest.logger, levels.DEBUG, 'after'), (log) => {
        });
    }

}