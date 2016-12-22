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


import { AppRegistry, User, Role, IRole, JsonReader, fromEnvironment } from '@fluxgate/common';
import { KnexService, MetadataService, AppRegistryService } from '../../src/ts-express-decorators/services';

export abstract class BaseTest {
    static readonly logger = getLogger('BaseTest');

    static appRegistryService: AppRegistryService;
    static knexService: KnexService;
    static metadataService: MetadataService;

    private static intialized = BaseTest.initialize();

    /**
     * statischer Initializer
     */
    private static initialize(): boolean {
       using(new XLog(BaseTest.logger, levels.INFO, 'initialize'), (log) => {
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
        return true;
    }

    protected constructor() {
    }

    
    protected static before() {
        using(new XLog(BaseTest.logger, levels.DEBUG, 'before'), (log) => {
            let knexConfigPath = path.join(process.cwd(), '/test/config/knexfile.json');
            log.log(`knexConfigPath = ${knexConfigPath}`);

            //
            // Konfiguration lesen und in AppRegistry ablegen
            //

            let config = JsonReader.readJsonSync<any>(knexConfigPath);


            log.log(`read knex config from ${knexConfigPath} for process.env.NODE_ENV = ${process.env.NODE_ENV}`);

            let systemEnv = fromEnvironment('NODE_ENV', 'development');
            systemEnv = 'local';        // TODO
            log.log(`systemEnv = ${systemEnv}`);

            let knexConfig: Knex.Config = config[systemEnv];
            AppRegistry.instance.add(KnexService.KNEX_CONFIG_KEY, knexConfig);

            BaseTest.appRegistryService = new AppRegistryService();
            BaseTest.knexService = new KnexService(BaseTest.appRegistryService);
            BaseTest.metadataService = new MetadataService();
        });
    }

}