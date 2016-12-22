let path = require('path');
import 'reflect-metadata';

import * as Mocha from 'mocha';
import * as chai from 'chai';
import { expect, should } from 'chai';
import * as chaiAsPromised from 'chai-as-promised';
import { } from 'chai-as-promised';
import { suite, test, slow, timeout, skip, only } from 'mocha-typescript';
import * as Knex from 'knex';



// Chai mit Promises verwenden (... to.become() ... etc.)
chai.use(chaiAsPromised);
chai.should();


// -------------------------- logging -------------------------------
import { Logger, levels, getLogger, configure } from 'log4js';
import { XLog, using } from 'enter-exit-logger';
// -------------------------- logging -------------------------------

import { AppRegistry, User, Role, IRole, JsonReader, fromEnvironment } from '@fluxgate/common';
import { AppRegistryService, KnexService, MetadataService, RoleService } from '../../../src/ts-express-decorators/services';

import { KnexTest } from '../knexTest';





@suite('erste Role Tests')
class RoleTest extends KnexTest {
    static readonly logger = getLogger('RoleTest');

    static readonly FIRST_ROLE_ID = 1000;
    private roleService: RoleService;

    constructor() {
        super();
    }

    static before() {
        super.before();
    }

    before() {
        using(new XLog(RoleTest.logger, levels.DEBUG, 'before'), (log) => {
            this.roleService = new RoleService(KnexTest.knexService, KnexTest.metadataService);
        })
    }

    private createRole(id: number): IRole {
        let role: IRole = {
            id: id,
            name: `Test-Rolename-${id}`,
            description: `Test-Roledescription-${id}`
        };

        return role;
    }


    static after() {
        return using(new XLog(RoleTest.logger, levels.INFO, 'after'), (log) => {
            let appRegistryService: AppRegistryService = new AppRegistryService();
            let cfg = appRegistryService.get(KnexService.KNEX_CONFIG_KEY);
            log.log(`cfg = ${JSON.stringify(cfg)}`);

            let knexService = new KnexService(appRegistryService);
            let metadataService: MetadataService = new MetadataService();

            let roleService = new RoleService(knexService, metadataService);

            // alle Testrollen löschen
            roleService.query(
                roleService.fromTable().where(roleService.idColumnName, '>=', RoleTest.FIRST_ROLE_ID).delete())
                .then((rowsAffected) => {
                    knexService.knex.destroy((done) => {
                        //log.info(done);
                    });
                });
        });
    }



    @test 'should find 3 roles'() {
        return expect(this.roleService.find()
            .then(function (roles) { return roles.length }))
            .to.become(3);
    }

    @test 'should create new role'() {
        let role = this.createRole(RoleTest.FIRST_ROLE_ID);
        return expect(this.roleService.create(role)).to.become(role);
    }

    @test 'should now find 4 roles'() {
        return expect(this.roleService.find()
            .then(function (roles) { return roles.length }))
            .to.become(4);
    }

    @test 'should create new role 1001'() {
        let role = this.createRole(RoleTest.FIRST_ROLE_ID + 1);
        return expect(this.roleService.create(role)).to.become(role);
    }

    @test 'should delete test role'() {
        let roleIdToDelete = RoleTest.FIRST_ROLE_ID;
        return expect(this.roleService.delete(roleIdToDelete))
            .to.become(roleIdToDelete);
    }
}