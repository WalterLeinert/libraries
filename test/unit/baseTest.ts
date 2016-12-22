let path = require('path');
import 'reflect-metadata';

import * as Mocha from 'mocha';
import * as chai from 'chai';
import { expect, should } from 'chai';
import * as chaiAsPromised from 'chai-as-promised';
import { } from 'chai-as-promised';
import * as Knex from 'knex';

// Chai mit Promises verwenden (... to.become() ... etc.)
chai.use(chaiAsPromised);
chai.should();

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

   
    protected constructor() {
    }


    protected static after() {
    }

    protected before() {
    }

    protected after() {
    }


    /**
     * wird einmal vor allen Tests ausgeführt
     */
    protected static before() {
        using(new XLog(BaseTest.logger, levels.DEBUG, 'before'), (log) => {
            BaseTest.initializeLogging(); 
        });
    }

    private static initializeLogging() {
        using(new XLog(BaseTest.logger, levels.INFO, 'initializeLogging'), (log) => {
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

}