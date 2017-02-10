import  path = require('path');
// tslint:disable-next-line:no-var-requires
require('reflect-metadata');

import * as Knex from 'knex';

// -------------------------- logging -------------------------------
import {
    configure, getLogger, ILogger, levels, Logger, using, XLog
} from '@fluxgate/common';
// -------------------------- logging -------------------------------


import { Activator, AppRegistry, fromEnvironment, ICtor, JsonReader } from '@fluxgate/common';
import { AppRegistryService, KnexService, MetadataService } from '../../src/ts-express-decorators-flx/services';

import { BaseTest } from './baseTest.spec';


/**
 * Basisklasse für alle Service-Klassen, die mit Knex auf die DB zugreifen.
 */
export abstract class KnexTest extends BaseTest {
    protected static readonly logger = getLogger(KnexTest);

    private static _appRegistryService: AppRegistryService;
    private static _knexService: KnexService;
    private static _metadataService: MetadataService;



    /**
     * wird einmal vor allen Tests ausgeführt
     * - Knex-Initialisierung
     */
    protected static before() {
        using(new XLog(KnexTest.logger, levels.INFO, 'static.before'), (log) => {
            super.before();

            const knexConfigPath = path.join(process.cwd(), '/test/config/knexfile.json');
            log.log(`knexConfigPath = ${knexConfigPath}`);

            //
            // Konfiguration lesen und in AppRegistry ablegen
            //
            const config = JsonReader.readJsonSync<any>(knexConfigPath);

            let systemEnv = fromEnvironment('NODE_ENV', 'development');
            systemEnv = 'local';        // TODO

            log.log(`read knex config from ${knexConfigPath} for systemEnv = ${systemEnv}`);

            const knexConfig: Knex.Config = config[systemEnv];
            AppRegistry.instance.add(KnexService.KNEX_CONFIG_KEY, knexConfig);

            KnexTest._appRegistryService = new AppRegistryService();
            KnexTest._knexService = new KnexService(KnexTest.appRegistryService);
            KnexTest._metadataService = new MetadataService();
        });
    }


    /**
     * wird einmal nach allen Tests ausgeführt
     * - Knex-Cleanup
     */
    protected static after() {
        using(new XLog(KnexTest.logger, levels.INFO, 'static.after'), (log) => {
            KnexTest.knexService.knex.destroy();

            super.after();
        });
    }

    /**
     * Helpermethode zum Erzeugen von Service-Klassen 
     */
    protected static createService<T>(model: ICtor<T>): T {
        return Activator.createInstance<T>(model, KnexTest.knexService, KnexTest.metadataService);
    }

    /**
     * wird vor jedem Test aufgerufen
     */
    protected before() {
        using(new XLog(KnexTest.logger, levels.INFO, 'before'), (log) => {
            super.before();
        });
    }

    /**
     * wird nach jedem Test aufgerufen
     */
    protected after() {
        using(new XLog(KnexTest.logger, levels.INFO, 'after'), (log) => {
            super.after();
        });
    }


    protected static get appRegistryService(): AppRegistryService {
        return KnexTest._appRegistryService;
    }

    private static get metadataService(): MetadataService {
        return KnexTest._metadataService;
    }

    private static get knexService(): KnexService {
        return KnexTest._knexService;
    }

}