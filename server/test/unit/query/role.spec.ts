// tslint:disable:member-access

// tslint:disable-next-line:no-var-requires
require('reflect-metadata');

// tslint:disable-next-line:no-var-requires
// let jsondiff = require('json-diff-patch');

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

        super.setup(RoleService, new NumberIdGenerator(1), () => {
          done();
        });
      });
    });
  }


  @test 'should find 3 roles'() {
    return expect(this.service.find(undefined)
      .then((result) => result.items.length))
      .to.become(3);
  }

  @test 'should create new role'() {
    const id = this.firstTestId + 1;

    const role = this.createRole(id);
    const expectedRoleResult = this.createExpectedRoleResult(id, CreateResult, this.getNextEntityVersionFor(Role));

    // this.service.create(role).then((result) => {
    //   const diff = jsondiff.diff(result, expectedRoleResult);

    //   Clone.diff(result, expectedRoleResult);
    // });
    return expect(this.service.create(undefined, role)).to.become(expectedRoleResult);
  }

  @test 'should now find 4 roles'() {
    return expect(this.service.find(undefined)
      .then((result) => result.items.length))
      .to.become(4);
  }

  @test 'should find new role'() {
    const expectedRoleResult = this.createExpectedRoleResult(this.firstTestId + 1, FindByIdResult,
      this.getEntityVersionFor(Role));

    // this.service.findById(expectedRoleResult.item.id).then((result) => {
    //   Clone.diff(result, expectedRoleResult);
    // });

    return expect(this.service.findById(undefined, expectedRoleResult.item.id))
      .to.become(expectedRoleResult);
  }

  @test 'should update new role'() {
    const id = this.firstTestId + 1;

    const Result = this.createExpectedRoleResult(id, UpdateResult, this.getNextEntityVersionFor(Role));
    Result.item.name = Result.item.name + '-updated';
    Result.item.description = Result.item.description + '-updated';

    const expectedRoleResult = Clone.clone(Result);
    expectedRoleResult.item.__version = Result.item.__version + 1;

    return expect(this.service.update(undefined, Result.item))
      .to.become(expectedRoleResult);
  }

  @test 'should create new role (2)'() {
    const id = this.firstTestId + 2;
    const role = this.createRole(id);
    const expectedRoleResult = this.createExpectedRoleResult(id, CreateResult, this.getNextEntityVersionFor(Role));
    return expect(this.service.create(undefined, role)).to.become(expectedRoleResult);
  }

  @test 'should now find 5 roles'() {
    return expect(this.service.find(undefined)
      .then((result) => result.items.length))
      .to.become(5);
  }

  @test 'should query roles'() {
    const id = this.firstTestId + 1;
    return expect(this.service.queryKnex(
      undefined,
      this.service.fromTable()
        .where(this.service.idColumnName, '>=', id))
      .then((result) => result.items.length))
      .to.become(2);
  }


  @test 'should query roles by name'() {
    return expect(this.service.queryKnex(
      undefined,
      this.service.fromTable()
        .where('role_name', '=', 'admin'))
      .then((result) => result.items.length))
      .to.become(1);
  }

  @test 'should query and test role by name'() {
    return expect(this.service.queryKnex(
      undefined,
      this.service.fromTable()
        .where('role_name', '=', 'admin'))
      .then((result) => result.items[0].id))
      .to.become(1);
  }



  @test 'should delete test role'() {
    const roleIdToDelete = this.firstTestId + 1;
    const expected = new DeleteResult(roleIdToDelete, this.getNextEntityVersionFor(Role));

    return expect(this.service.delete(undefined, roleIdToDelete))
      .to.become(expected);
  }

  @test 'should now find 4 roles again'() {
    return expect(this.service.find(undefined)
      .then((result) => result.items.length))
      .to.become(4);
  }


  private createRole(id: number): IRole {
    const role: Role = new Role();
    role.id = undefined;
    role.name = `Test-Rolename-${id}`;
    role.description = `Test-Roledescription-${id}`;
    role.id_client = 1;
    role.deleted = false;
    role.__version = 0;

    return role;
  }

  private createExpectedRoleResult<T extends ServiceResult>(id: number, resultCtor: ICtor<T>,
    expectedEntityVersion: number): T {
    const role: Role = this.createRole(id);
    role.id = id;
    return new resultCtor(role, expectedEntityVersion);
  }

}