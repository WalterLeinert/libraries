// tslint:disable:member-access

// tslint:disable-next-line:no-var-requires
require('reflect-metadata');

import * as chai from 'chai';
import { expect } from 'chai';
import * as chaiAsPromised from 'chai-as-promised';
import { } from 'chai-as-promised';
import { suite, test } from 'mocha-typescript';


// Chai mit Promises verwenden (... to.become() ... etc.)
chai.use(chaiAsPromised);
chai.should();

// -------------------------- logging -------------------------------
import {
    configure, getLogger, ILogger, levels, Logger, using, XLog
} from '@fluxgate/common';
// -------------------------- logging -------------------------------

import { IRole, Role } from '@fluxgate/common';
import { RoleService } from '../../../src/ts-express-decorators-flx/services';
import { BaseService } from '../../../src/ts-express-decorators-flx/services/base.service';

import { KnexTest } from '../knexTest.spec';


@suite('erste Role Tests')
class RoleTest extends KnexTest {
    protected static readonly logger = getLogger(RoleTest);

    private static readonly FIRST_ROLE_ID = 1000;
    private static roleService: BaseService<Role, number>;


    public static before() {
        using(new XLog(RoleTest.logger, levels.INFO, 'static.before'), (log) => {
            super.before();

            RoleTest.roleService = KnexTest.createService(RoleService);
        });
    }

    public static after() {
        return using(new XLog(RoleTest.logger, levels.INFO, 'static.after'), (log) => {

            // alle Testrollen löschen
            RoleTest.roleService.queryKnex(
                RoleTest.roleService.fromTable().where(RoleTest.roleService.idColumnName, '>=',
                    RoleTest.FIRST_ROLE_ID).delete())
                .then((rowsAffected) => {
                    super.after();
                });
        });
    }


    constructor() {
        super();
    }


    public before() {
        using(new XLog(RoleTest.logger, levels.INFO, 'before'), (log) => {
            super.before();
            // ok
        });
    }



    @test 'should find 3 roles'() {
        return expect(RoleTest.roleService.find()
            .then((roles) => roles.length))
            .to.become(3);
    }

    @test 'should create new role with id 1000'() {
        const role = this.createRole(RoleTest.FIRST_ROLE_ID);
        return expect(RoleTest.roleService.create(role)).to.become(role);
    }

    @test 'should now find 4 roles'() {
        return expect(RoleTest.roleService.find()
            .then((roles) => roles.length))
            .to.become(4);
    }

    @test 'should find new role'() {
        const role = this.createRole(RoleTest.FIRST_ROLE_ID);
        return expect(RoleTest.roleService.findById(RoleTest.FIRST_ROLE_ID))
            .to.become(role);
    }

    @test 'should update new role'() {
        const role = this.createRole(RoleTest.FIRST_ROLE_ID);
        role.name = role.name + '-updated';
        role.description = role.description + '-updated';
        return expect(RoleTest.roleService.update(role))
            .to.become(role);
    }

    @test 'should create new role 1001'() {
        const role = this.createRole(RoleTest.FIRST_ROLE_ID + 1);
        return expect(RoleTest.roleService.create(role)).to.become(role);
    }

    @test 'should now find 5 roles'() {
        return expect(RoleTest.roleService.find()
            .then((roles) => roles.length))
            .to.become(5);
    }

    @test 'should query roles'() {
        return expect(RoleTest.roleService.queryKnex(
            RoleTest.roleService.fromTable()
                .where(RoleTest.roleService.idColumnName, '>=', RoleTest.FIRST_ROLE_ID))
            .then((roles) => roles.length))
            .to.become(2);
    }


    @test 'should query roles by name'() {
        return expect(RoleTest.roleService.queryKnex(
            RoleTest.roleService.fromTable()
                .where('role_name', '=', 'admin'))
            .then((roles) => roles.length))
            .to.become(1);
    }

    @test 'should query and test role by name'() {
        return expect(RoleTest.roleService.queryKnex(
            RoleTest.roleService.fromTable()
                .where('role_name', '=', 'admin'))
            .then((roles) => roles[0].id))
            .to.become(1);
    }



    @test 'should delete test role'() {
        const roleIdToDelete = RoleTest.FIRST_ROLE_ID;
        return expect(RoleTest.roleService.delete(roleIdToDelete))
            .to.become(roleIdToDelete);
    }

    @test 'should now find 4 roles again'() {
        return expect(RoleTest.roleService.find()
            .then((roles) => roles.length))
            .to.become(4);
    }



    private createRole(id: number): IRole {
        const role: IRole = {
            id: id,
            name: `Test-Rolename-${id}`,
            description: `Test-Roledescription-${id}`
        };

        return role;
    }

}