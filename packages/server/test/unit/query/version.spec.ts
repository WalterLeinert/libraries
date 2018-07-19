// tslint:disable:member-access
// tslint:disable:max-classes-per-file

// tslint:disable-next-line:no-var-requires
require('reflect-metadata');

import * as chai from 'chai';
import * as chaiAsPromised from 'chai-as-promised';
import 'mocha';
import { suite, test } from 'mocha-typescript';


// Chai mit Promises verwenden (... to.become() ... etc.)
chai.use(chaiAsPromised);
chai.should();

// -------------------------- logging -------------------------------
// tslint:disable-next-line:no-unused-variable
import { getLogger, ILogger, levels, using, XLog } from '@fluxgate/platform';
// -------------------------- logging -------------------------------

import { ConstantValueGenerator, NumberIdGenerator, QueryTest } from '@fluxgate/common';

import { EntityVersionTestBase } from '../entity-version-test-base';
import { KnexTest } from '../knex-test';
import { QueryTestService } from './query-test.service';


@suite('test entity versioning')
class VersionTest extends EntityVersionTestBase<QueryTest, number> {
  protected static readonly logger = getLogger(VersionTest);

  public static readonly ITEMS = 5;
  public static readonly MAX_ITEMS = 10;


  constructor() {
    super({
      count: VersionTest.ITEMS,
      maxCount: VersionTest.MAX_ITEMS,
      idGenerator: new NumberIdGenerator(VersionTest.MAX_ITEMS),
      columns: {
        __version: new ConstantValueGenerator(0),
        __status: new ConstantValueGenerator(0),
        __test: new ConstantValueGenerator(0),
      },
      tableMetadata: KnexTest.metadataService.findTableMetadata(QueryTest)

    });
  }


  public static before(done: () => void) {
    using(new XLog(VersionTest.logger, levels.INFO, 'static.before'), (log) => {
      super.before(() => {

        super.setup(QueryTestService, new NumberIdGenerator(1), () => {
          done();
        });
      });
    });
  }


  @test 'should create new record -> version == 0'(done: (err?: any) => void) {
    const item1 = this.createItem();
    const ev = this.getNextEntityVersionFor(QueryTest);
    this.service.create(undefined, item1).then((result) => {
      if (result.item.__version !== 0) {
        done(`${result.item.__version} must be 0.`);
        return;
      }
      if (result.entityVersion !== ev) {
        done(`${result.entityVersion} must be ${ev}`);
        return;
      }
      done();
    });
  }


  @test 'should update record -> version == 1'(done: (err?: any) => void) {
    this.service.find(undefined).then((findResult) => {

      const itemsSorted = findResult.items.sort((it1, it2) => it1.id - it2.id);
      const item = itemsSorted[itemsSorted.length - 1];

      item.name = item.name + '-updated';
      this.service.update(undefined, item).then((updateResult) => {
        if (updateResult.item.__version !== item.__version + 1) {
          done(`entity: versions different: ${updateResult.item.__version} !== ${item.__version}`);
        } else {
          done();
        }
      });
    });
  }


  @test 'should update record -> version == 2'(done: (err?: any) => void) {
    this.service.find(undefined).then((findResult) => {

      const itemsSorted = findResult.items.sort((it1, it2) => it1.id - it2.id);
      const item = itemsSorted[itemsSorted.length - 1];

      item.name = item.name + '-updated2';
      this.service.update(undefined, item).then((updateResult) => {
        if (updateResult.item.__version !== item.__version + 1) {
          done(`entity: versions different: ${updateResult.item.__version} !== ${item.__version}`);
        } else {
          done();
        }
      });
    });
  }
}