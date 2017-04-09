// tslint:disable:member-access

// tslint:disable-next-line:no-var-requires
require('reflect-metadata');

import * as chai from 'chai';
import { expect } from 'chai';
import * as chaiAsPromised from 'chai-as-promised';
import { suite, test } from 'mocha-typescript';


// Chai mit Promises verwenden (... to.become() ... etc.)
chai.use(chaiAsPromised);
chai.should();

// -------------------------- logging -------------------------------
// tslint:disable-next-line:no-unused-variable
import { getLogger, ILogger, levels, using, XLog } from '@fluxgate/common';
// -------------------------- logging -------------------------------

import { Clone, IRole, Role, ServiceResult, Status } from '@fluxgate/common';
import { RoleService } from '../../../src/ts-express-decorators-flx/services';
import { BaseService } from '../../../src/ts-express-decorators-flx/services/base.service';

import { KnexTest } from '../knexTest.spec';


@suite('erste Role Tests')
class RoleTest extends KnexTest {
  protected static readonly logger = getLogger(RoleTest);

  private static roleService: BaseService<Role, number>;
  private static maxRoleId: number;

  public static before() {
    using(new XLog(RoleTest.logger, levels.INFO, 'static.before'), (log) => {
      super.before();

      RoleTest.roleService = KnexTest.createService(RoleService);

      // max. bisherige id ermitteln
      RoleTest.roleService.find()
        .then((roles) => {
          const ids = roles.map((item) => item.id);
          RoleTest.maxRoleId = Math.max(...ids);
        });
    });
  }

  public static after() {
    return using(new XLog(RoleTest.logger, levels.INFO, 'static.after'), (log) => {

      // alle Testrollen löschen
      RoleTest.roleService.queryKnex(
        RoleTest.roleService.fromTable().where(RoleTest.roleService.idColumnName, '>=',
          this.maxRoleId + 1).delete())
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
    });
  }



  @test 'should find 3 roles'() {
    return expect(RoleTest.roleService.find()
      .then((roles) => roles.length))
      .to.become(3);
  }

  @test 'should create new role'() {
    const id = RoleTest.maxRoleId + 1;

    const role = this.createRole(id);
    const expectedRole = this.createExpectedRole(id);
    return expect(RoleTest.roleService.create(role)).to.become(expectedRole);
  }

  @test 'should now find 4 roles'() {
    return expect(RoleTest.roleService.find()
      .then((roles) => roles.length))
      .to.become(4);
  }

  @test 'should find new role'() {
    const expectedRole = this.createExpectedRole(RoleTest.maxRoleId + 1);
    return expect(RoleTest.roleService.findById(expectedRole.id))
      .to.become(expectedRole);
  }

  @test 'should update new role'() {
    const id = RoleTest.maxRoleId + 1;

    const role = this.createExpectedRole(id);
    role.name = role.name + '-updated';
    role.description = role.description + '-updated';

    const expectedRole = Clone.clone(role);

    return expect(RoleTest.roleService.update(role))
      .to.become(expectedRole);
  }

  @test 'should create new role (2)'() {
    const id = RoleTest.maxRoleId + 2;
    const role = this.createRole(id);
    const expectedRole = this.createExpectedRole(id);
    return expect(RoleTest.roleService.create(role)).to.become(expectedRole);
  }

  @test 'should now find 5 roles'() {
    return expect(RoleTest.roleService.find()
      .then((roles) => roles.length))
      .to.become(5);
  }

  @test 'should query roles'() {
    const id = RoleTest.maxRoleId + 1;
    return expect(RoleTest.roleService.queryKnex(
      RoleTest.roleService.fromTable()
        .where(RoleTest.roleService.idColumnName, '>=', id))
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
    const roleIdToDelete = RoleTest.maxRoleId + 1;
    const expected = new ServiceResult(roleIdToDelete, Status.Ok);

    return expect(RoleTest.roleService.delete(roleIdToDelete))
      .to.become(expected);
  }

  @test 'should now find 4 roles again'() {
    return expect(RoleTest.roleService.find()
      .then((roles) => roles.length))
      .to.become(4);
  }

  private createRole(id: number): IRole {
    const role: IRole = {
      id: undefined,
      name: `Test-Rolename-${id}`,
      description: `Test-Roledescription-${id}`,
      id_mandant: 1,
      deleted: false,
      __version: 0
    };

    return role;
  }

  private createExpectedRole(id: number): IRole {
    const role: IRole = this.createRole(id);
    role.id = id;
    return role;
  }

}