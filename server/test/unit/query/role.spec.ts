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
import { getLogger, ILogger, levels, using, XLog } from '@fluxgate/platform';
// -------------------------- logging -------------------------------

import {
  CreateResult, DeleteResult, FindByIdResult, IRole, NumberIdGenerator, Role,
  ServiceResult, UpdateResult
} from '@fluxgate/common';
import { Clone, ICtor } from '@fluxgate/core';

import { RoleService } from '../../../src/ts-express-decorators-flx/services/role.service';

import { KnexTest } from '../knexTest.spec';


@suite('erste Role Tests')
class RoleTest extends KnexTest<Role, number> {
  protected static readonly logger = getLogger(RoleTest);

  public static before(done: () => void) {
    using(new XLog(RoleTest.logger, levels.INFO, 'static.before'), (log) => {
      super.before(() => {

        super.setup(Role, RoleService, new NumberIdGenerator(1), () => {
          done();
        });
      });
    });
  }


  @test 'should find 3 roles'() {
    return expect(this.service.find()
      .then((result) => result.items.length))
      .to.become(3);
  }

  @test 'should create new role'() {
    const id = this.firstTestId + 1;

    const role = this.createRole(id);
    const expectedRole = this.createExpectedRole(id, CreateResult);
    return expect(this.service.create(role)).to.become(expectedRole);
  }

  @test 'should now find 4 roles'() {
    return expect(this.service.find()
      .then((result) => result.items.length))
      .to.become(4);
  }

  @test 'should find new role'() {
    const expectedRole = this.createExpectedRole(this.firstTestId + 1, FindByIdResult);
    return expect(this.service.findById(expectedRole.item.id))
      .to.become(expectedRole);
  }

  @test 'should update new role'() {
    const id = this.firstTestId + 1;

    const roleResult = this.createExpectedRole(id, UpdateResult);
    roleResult.item.name = roleResult.item.name + '-updated';
    roleResult.item.description = roleResult.item.description + '-updated';

    const expectedRoleResult = Clone.clone(roleResult);
    expectedRoleResult.item.__version = roleResult.item.__version + 1;

    return expect(this.service.update(roleResult.item))
      .to.become(expectedRoleResult);
  }

  @test 'should create new role (2)'() {
    const id = this.firstTestId + 2;
    const role = this.createRole(id);
    const expectedRole = this.createExpectedRole(id, CreateResult);
    return expect(this.service.create(role)).to.become(expectedRole);
  }

  @test 'should now find 5 roles'() {
    return expect(this.service.find()
      .then((result) => result.items.length))
      .to.become(5);
  }

  @test 'should query roles'() {
    const id = this.firstTestId + 1;
    return expect(this.service.queryKnex(
      this.service.fromTable()
        .where(this.service.idColumnName, '>=', id))
      .then((result) => result.items.length))
      .to.become(2);
  }


  @test 'should query roles by name'() {
    return expect(this.service.queryKnex(
      this.service.fromTable()
        .where('role_name', '=', 'admin'))
      .then((result) => result.items.length))
      .to.become(1);
  }

  @test 'should query and test role by name'() {
    return expect(this.service.queryKnex(
      this.service.fromTable()
        .where('role_name', '=', 'admin'))
      .then((result) => result.items[0].id))
      .to.become(1);
  }



  @test 'should delete test role'() {
    const roleIdToDelete = this.firstTestId + 1;
    const expected = new DeleteResult(roleIdToDelete, -1);

    return expect(this.service.delete(roleIdToDelete))
      .to.become(expected);
  }

  @test 'should now find 4 roles again'() {
    return expect(this.service.find()
      .then((result) => result.items.length))
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

  private createExpectedRole<T extends ServiceResult>(id: number, resultCtor: ICtor<T>): T {
    const role: IRole = this.createRole(id);
    role.id = id;
    return new resultCtor(role, -1);
  }

}