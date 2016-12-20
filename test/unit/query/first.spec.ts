let path = require('path');
import 'reflect-metadata';
import * as Mocha from 'mocha';
import * as Knex from 'knex';


// -------------------------- logging -------------------------------
import { Logger, levels, getLogger } from 'log4js';
import { XLog, using } from 'enter-exit-logger';
// -------------------------- logging -------------------------------


import { AppRegistry, User, Role, JsonReader, fromEnvironment } from '@fluxgate/common';

import { AppRegistryService, KnexService, MetadataService, RoleService } from '../../../src/ts-express-decorators/services';

let logger = getLogger('first.spec');

describe('first test', () => {
    let roleService: RoleService;

    beforeEach(() => {
        let knexConfigPath = path.join(__dirname, '../../../../test/config/knexfile.json');
        logger.info(`knexConfigPath = ${knexConfigPath}`);

        //
        // Konfiguration lesen und in AppRegistry ablegen
        //

        let config = JsonReader.readJsonSync<any>(knexConfigPath);


        logger.info(`read knex config from ${knexConfigPath} for process.env.NODE_ENV = ${process.env.NODE_ENV}`);

        let systemEnv = fromEnvironment('NODE_ENV', 'development');
        systemEnv = 'local';        // TODO
        logger.info(`systemEnv = ${systemEnv}`);

        let knexConfig: Knex.Config = config[systemEnv];
        AppRegistry.instance.add(KnexService.KNEX_CONFIG_KEY, knexConfig);

        let appRegistryService: AppRegistryService = new AppRegistryService();
        let cfg = appRegistryService.get(KnexService.KNEX_CONFIG_KEY);
        logger.info(`cfg = ${JSON.stringify(cfg)}`);


        let knexService: KnexService = new KnexService(appRegistryService);
        let metadataService: MetadataService = new MetadataService();



        roleService = new RoleService(knexService, metadataService);
    });

    afterEach(() => {

    });

    it('should ...', () => {
        roleService.find()
            .then((roles => {
                logger.info(`${roles.length} roles found`);
            }))
            .catch((err) => {
                logger.error(err);
            })

        //expect('')
    })

});