// tslint:disable:member-access
// tslint:disable:max-classes-per-file

// tslint:disable-next-line:no-var-requires
require('reflect-metadata');

import * as chai from 'chai';
import { expect } from 'chai';
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

import { ConstantValueGenerator, NumberIdGenerator } from '@fluxgate/common';

import { KnexTest } from '../knexTest.spec';
import { QueryTest } from './query-test';
import { QueryTestService } from './query-test.service';


@suite('test entity versioning')
class VersionTest extends KnexTest<QueryTest, number> {
  protected static readonly logger = getLogger(VersionTest);

  public static readonly ITEMS = 5;
  public static readonly MAX_ITEMS = 10;


  constructor() {
    super({
      modelClass: QueryTest,
      count: VersionTest.ITEMS,
      maxCount: VersionTest.MAX_ITEMS,
      idGenerator: new NumberIdGenerator(VersionTest.MAX_ITEMS),
      columnConfig: {
        __version: new ConstantValueGenerator(0),
        __test: new ConstantValueGenerator(0),
      }
    });
  }


  public static before(done: () => void) {
    using(new XLog(VersionTest.logger, levels.INFO, 'static.before'), (log) => {
      super.before(() => {

        super.setup(QueryTest, QueryTestService, new NumberIdGenerator(1), () => {
          done();
        });
      });
    });
  }


  @test 'should create new record -> version == 0'() {
    const item1 = this.createItem();
    expect(this.service.create(item1).then((result) => result.item.__version)).to.become(0);
  }


  @test 'should update record -> version == 1'(done: (err?: any) => void) {
    this.service.find().then((findResult) => {

      const itemsSorted = findResult.items.sort((it1, it2) => it1.id - it2.id);
      const item = itemsSorted[itemsSorted.length - 1];

      item.name = item.name + '-updated';
      this.service.update(item).then((updateResult) => {
        if (updateResult.item.__version !== item.__version + 1) {
          done(`entity: versions different: ${updateResult.item.__version} !== ${item.__version}`);
        } else {
          done();
        }
      });
    });
  }


  @test 'should update record -> version == 2'(done: (err?: any) => void) {
    this.service.find().then((findResult) => {

      const itemsSorted = findResult.items.sort((it1, it2) => it1.id - it2.id);
      const item = itemsSorted[itemsSorted.length - 1];

      item.name = item.name + '-updated2';
      this.service.update(item).then((updateResult) => {
        if (updateResult.item.__version !== item.__version + 1) {
          done(`entity: versions different: ${updateResult.item.__version} !== ${item.__version}`);
        } else {
          done();
        }
      });
    });
  }
}