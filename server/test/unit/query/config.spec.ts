// tslint:disable:member-access

// tslint:disable-next-line:no-var-requires
require('reflect-metadata');

// tslint:disable-next-line:no-var-requires
// let jsondiff = require('json-diff-patch');

import * as chai from 'chai';
import { expect } from 'chai';
import * as chaiAsPromised from 'chai-as-promised';
import { only, suite, test } from 'mocha-typescript';


// Chai mit Promises verwenden (... to.become() ... etc.)
chai.use(chaiAsPromised);
chai.should();

// -------------------------- logging -------------------------------
// tslint:disable-next-line:no-unused-variable
import { getLogger, ILogger, levels, using, XLog } from '@fluxgate/platform';
// -------------------------- logging -------------------------------

import {
  ConstantValueGenerator,
  CreateResult, DeleteResult, EntityStatus, FilterBehaviour, FindByIdResult, IRole,
  Role, ServiceResult, SmtpConfig, StatusFilter, StatusQuery, StringIdGenerator, UpdateResult
} from '@fluxgate/common';
import { Clone, ICtor, SelectorTerm } from '@fluxgate/core';

import { ConfigService } from '../../../src/ts-express-decorators-flx/services/config.service';

import { KnexTest } from '../knexTest.spec';


@suite('erste Config Tests') @only
class ConfigTest extends KnexTest<Role, number> {
  protected static readonly logger = getLogger(ConfigTest);

  public static readonly ITEMS = 5;
  public static readonly MAX_ITEMS = 10;

  public static before(done: () => void) {
    using(new XLog(ConfigTest.logger, levels.INFO, 'static.before'), (log) => {
      super.before(() => {

        super.setupConfig(ConfigService, SmtpConfig, {
          count: ConfigTest.ITEMS,
          maxCount: ConfigTest.MAX_ITEMS,
          idGenerator: new StringIdGenerator(ConfigTest.MAX_ITEMS, 'Smtp'),
          columns: {
            type: new ConstantValueGenerator('smtp'),
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


  @test 'should find no config entry (with id "smtp-xxx")'() {
    return expect(this.configService.find(undefined, SmtpConfig.name)
      .then((result) => result.items.length))
      .to.become(0);
  }
}