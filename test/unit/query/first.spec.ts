let path = require('path');
import 'reflect-metadata';
import * as Mocha from 'mocha';
import * as chai from 'chai';
import { expect, should } from 'chai';
import * as chaiAsPromised from 'chai-as-promised';
import { } from 'chai-as-promised';
import * as Knex from 'knex';

chai.use(chaiAsPromised);
chai.should();


// -------------------------- logging -------------------------------
import { Logger, levels, getLogger, configure } from 'log4js';
import { XLog, using } from 'enter-exit-logger';
// -------------------------- logging -------------------------------

import { AppRegistry, User, Role, IRole, JsonReader, fromEnvironment } from '@fluxgate/common';
import { AppRegistryService, KnexService, MetadataService, RoleService } from '../../../src/ts-express-decorators/services';

let logger = getLogger('first.spec');

// Logging konfigurieren ...
let systemMode = fromEnvironment('NODE_ENV', 'development');

if (systemMode) {
    let configFile = 'log4js.' + systemMode + '.json';
    let configPath = path.join('/test/config', configFile);
    configPath = path.join(process.cwd(), configPath);
    console.info(`log4js: systemMode = ${systemMode}, module = ${path.basename(__filename)}, configPath = ${configPath}`);

    configure(configPath);
} else {
    console.info(`log4js: no systemMode defined -> not reading configuration`)
}





function createRole(id: number): IRole {
    let role: IRole = {
        id: id,
        name: `Test-Rolename-${id}`,
        description: `Test-Roledescription-${id}`
    };

    return role;
}


describe('first test', () => {
    let knexService: KnexService;
    let roleService: RoleService;

    before(() => {
        using(new XLog(logger, levels.DEBUG, 'before'), (log) => {
            let knexConfigPath = path.join(__dirname, '../../../../test/config/knexfile.json');
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

            let appRegistryService: AppRegistryService = new AppRegistryService();
            let cfg = appRegistryService.get(KnexService.KNEX_CONFIG_KEY);
            log.log(`cfg = ${JSON.stringify(cfg)}`);


            knexService = new KnexService(appRegistryService);
            let metadataService: MetadataService = new MetadataService();

            roleService = new RoleService(knexService, metadataService);
        })

    });


    function closeDb(log: XLog, knex: Knex) {
        knex.destroy((err) => {
            log.error(err);
        });
    }

    after(() => {
        using(new XLog(logger, levels.DEBUG, 'after'), (log) => {

            // alle Testrollen löschen
            roleService.query(
                roleService.fromTable().where(roleService.idColumnName, '>=', 1000).delete())
                .then((rowsAffected) => {
                    closeDb(log, knexService.knex);
                })
                .catch(err => {
                    log.error(err);
                    closeDb(log, knexService.knex);
                });
        });
    });


    it('should find 3 roles', () => {
        return expect(roleService.find()
            .then(function (roles) { return roles.length }))
            .to.become(3);
    });

    it('should create new role', () => {
        let role = createRole(1000);
        return expect(roleService.create(role)).to.become(role);
    });

    it('should now find 4 roles', () => {
        return expect(roleService.find()
            .then(function (roles) { return roles.length }))
            .to.become(4);
    });


    it('should create new role', () => {
        let role = createRole(1001);
        return expect(roleService.create(role)).to.become(role);
    });

    it('should delete test role', () => {
        let roleIdToDelete = 1000;
        return expect(roleService.delete(roleIdToDelete))
            .to.become(roleIdToDelete);
    });
});