import 'reflect-metadata';

import * as chai from 'chai';
import { expect } from 'chai';
import * as chaiAsPromised from 'chai-as-promised';
import { } from 'chai-as-promised';
import { suite, test } from 'mocha-typescript';


// Chai mit Promises verwenden (... to.become() ... etc.)
chai.use(chaiAsPromised);
chai.should();


// -------------------------- logging -------------------------------
import { levels, getLogger } from 'log4js';
import { XLog, using } from 'enter-exit-logger';
// -------------------------- logging -------------------------------

import { Role, IRole } from '@fluxgate/common';
//import { RoleService } from '../../../src/ts-express-decorators/services';
import { BaseService } from '../../../src/ts-express-decorators/services/base.service';

import { KnexTest } from '../knexTest';


@suite('erste Role Tests')
class RoleTest extends KnexTest {
    static readonly logger = getLogger('RoleTest');

    static readonly FIRST_ROLE_ID = 1000;
    static roleService: BaseService<Role, number>;

    constructor() {
        super();
    }

    static before() {
        using(new XLog(RoleTest.logger, levels.INFO, 'static.before'), (log) => {
            super.before();

            RoleTest.roleService = KnexTest.createService<Role, number>(Role);
        });
    }

    static after() {
        return using(new XLog(RoleTest.logger, levels.INFO, 'static.after'), (log) => {
        
            // alle Testrollen löschen
            RoleTest.roleService.query(
                RoleTest.roleService.fromTable().where(RoleTest.roleService.idColumnName, '>=', RoleTest.FIRST_ROLE_ID).delete())
                .then((rowsAffected) => {
                    super.after();
                });
        });
    }

    
    before() {
        using(new XLog(RoleTest.logger, levels.INFO, 'before'), (log) => {
            super.before();

            // ok
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


    @test 'should find 3 roles'() {
        return expect(RoleTest.roleService.find()
            .then(function (roles) { return roles.length }))
            .to.become(3);
    }

    @test 'should create new role with id 1000'() {
        let role = this.createRole(RoleTest.FIRST_ROLE_ID);
        return expect(RoleTest.roleService.create(role)).to.become(role);
    }

    @test 'should now find 4 roles'() {
        return expect(RoleTest.roleService.find()
            .then(function (roles) { return roles.length }))
            .to.become(4);
    }
    
    @test 'should find new role'() {
        let role = this.createRole(RoleTest.FIRST_ROLE_ID);
        return expect(RoleTest.roleService.findById(RoleTest.FIRST_ROLE_ID))
            .to.become(role);
    }

    @test 'should update new role'() {
        let role = this.createRole(RoleTest.FIRST_ROLE_ID);
        role.name = role.name + '-updated';
        role.description = role.description + '-updated';
        return expect(RoleTest.roleService.update(role))
            .to.become(role);
    }

    @test 'should create new role 1001'() {
        let role = this.createRole(RoleTest.FIRST_ROLE_ID + 1);
        return expect(RoleTest.roleService.create(role)).to.become(role);
    }

    @test 'should now find 5 roles'() {
        return expect(RoleTest.roleService.find()
            .then(function (roles) { return roles.length }))
            .to.become(5);
    }

    @test 'should delete test role'() {
        let roleIdToDelete = RoleTest.FIRST_ROLE_ID;
        return expect(RoleTest.roleService.delete(roleIdToDelete))
            .to.become(roleIdToDelete);
    }

    @test 'should now find 4 roles again'() {
        return expect(RoleTest.roleService.find()
            .then(function (roles) { return roles.length }))
            .to.become(4);
    }
}