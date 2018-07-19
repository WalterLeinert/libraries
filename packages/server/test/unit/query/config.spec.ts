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
  ConfigBase, ConstantValueGenerator, CreateResult, IStatusQuery, NopValueGenerator,
  ServiceResult, SmtpConfig, StringIdGenerator, UpdateResult
} from '@fluxgate/common';
import { Clone, ICtor, SelectorTerm } from '@fluxgate/core';

import { ConfigService } from '../../../src/ts-express-decorators-flx/services/config.service';

import { KnexTest } from '../knex-test';


// declare function pick<T, K extends keyof T>(obj: T, ...keys: K[]): Pick<T, K>;


@suite('SmtpConfig Tests')
class ConfigTest extends KnexTest<SmtpConfig, string> {
  protected static readonly logger = getLogger(ConfigTest);

  public static readonly ITEMS = 5;
  public static readonly MAX_ITEMS = 10;

  public static before(done: () => void) {
    using(new XLog(ConfigTest.logger, levels.INFO, 'static.before'), (log) => {
      super.before(() => {

        super.setupConfig(ConfigService, SmtpConfig, {
          count: ConfigTest.ITEMS,
          maxCount: ConfigTest.MAX_ITEMS,
          idGenerator: new NopValueGenerator(),
          columns: {
            configId: new StringIdGenerator(ConfigTest.MAX_ITEMS, '@test'),
            type: new ConstantValueGenerator('smtp'),
            __client: new ConstantValueGenerator(1),
            __version: new ConstantValueGenerator(0)
          },

          tableMetadata: KnexTest.metadataService.findTableMetadata(SmtpConfig)
        },
          () => {
            done();
          });
      });
    });
  }


  @test 'should find 2 config entries (with id "smtp-xxx")'() {
    return expect(this.configService.find(undefined)
      .then((result) => result.items.length))
      .to.become(2);
  }


  @test 'should create new config'() {
    const configId = '@test1';
    const config = this.createConfig(configId);

    // updateResult.entityVersion ist für den Test nicht relevant -> vom Ergebnis übernehmen
    const expectedConfigResult = this.createExpectedConfigResult<CreateResult<SmtpConfig, string>>(
      configId, CreateResult, undefined);

    return expect(this.configService.create(undefined, config)
      .then((createResult) => createResult.item))
      .to.become(expectedConfigResult.item);
  }


  @test 'should now find 3 config entries (additional with id "smtp-@test1")'() {
    return expect(this.configService.find(undefined)
      .then((result) => result.items.length))
      .to.become(3);
  }

  @test 'should find 1 config entry (findById)'() {
    const configId = '@test1';
    const id = ConfigBase.createId(
      SmtpConfig.TYPE, configId);
    return expect(this.configService.findById(undefined, id)
      .then((result) => result.item.id))
      .to.become(id);
  }


  @test 'should query all entries of type smtp'() {
    return expect(this.configService.query(undefined, {
      term: new SelectorTerm({ name: 'type', operator: '=', value: 'smtp' })
    })
      .then((result) => result.items.length))
      .to.become(3);
  }


  @test 'should update config'() {
    const configId = '@test1';

    const result = this.createExpectedConfigResult<UpdateResult<SmtpConfig, string>>(configId, UpdateResult, -1);
    result.item.description = result.item.description + '-updated';

    const resultCloned = Clone.clone(result);
    resultCloned.item.__version++;

    return expect(this.configService.update(undefined, result.item)
      .then((updateResult) => updateResult.item))
      .to.become(resultCloned.item);
  }


  @test 'should delete config'() {
    const configId = '@test1';

    const result = this.createExpectedConfigResult<UpdateResult<SmtpConfig, string>>(configId, UpdateResult, -1);
    result.item.description = result.item.description + '-updated';

    return expect(this.configService.delete(undefined, ConfigBase.createId(SmtpConfig.TYPE, configId))
      .then((deleteResult) => deleteResult.id))
      .to.become(ConfigBase.createId(SmtpConfig.TYPE, configId));
  }


  @test 'should find again 2 config entries (after deletion)'() {
    return expect(this.configService.find(undefined)
      .then((result) => result.items.length))
      .to.become(2);
  }




  private createConfig(configId: string): SmtpConfig {
    const config: SmtpConfig = new SmtpConfig();
    config.configId = configId;
    config.type = 'smtp';
    config.description = `Test-Configdescription-${configId}`;
    config.host = 'localhost';
    config.from = 'walter';
    config.user = 'christian';
    config.password = 'password';
    config.port = 4711;
    config.ssl = false;

    config.__version = 0;
    config.__client = 1;

    return config;
  }

  private createExpectedConfigResult<T extends ServiceResult>(configId: string, resultCtor: ICtor<T>,
    expectedEntityVersion: number): T {
    const config = this.createConfig(configId);
    config.configId = configId;
    return new resultCtor(config, expectedEntityVersion);
  }

}