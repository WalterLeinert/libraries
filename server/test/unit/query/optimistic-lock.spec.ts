// tslint:disable:member-access
// tslint:disable:max-classes-per-file

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

import { ConstantValueGenerator, NumberIdGenerator } from '@fluxgate/common';
import { Clone, OptimisticLockException } from '@fluxgate/core';

import { KnexTest } from '../knexTest.spec';
import { QueryTest } from './query-test';
import { QueryTestService } from './query-test.service';




@suite('test optimistic locking')
class OptimisticLockTest extends KnexTest<QueryTest, number> {
  protected static readonly logger = getLogger(OptimisticLockTest);

  public static readonly ITEMS = 5;
  public static readonly MAX_ITEMS = 10;

  constructor() {
    super({
      modelClass: QueryTest,
      count: OptimisticLockTest.ITEMS,
      maxCount: OptimisticLockTest.MAX_ITEMS,
      idGenerator: new NumberIdGenerator(OptimisticLockTest.MAX_ITEMS),
      columnConfig: {
        __version: new ConstantValueGenerator(0),
        __test: new ConstantValueGenerator(0),
      }
    });
  }

  public static before(done: () => void) {
    using(new XLog(OptimisticLockTest.logger, levels.INFO, 'static.before'), (log) => {
      super.before(() => {

        super.setup(QueryTest, QueryTestService, new NumberIdGenerator(1), () => {
          done();
        });
      });
    });
  }


  @test 'should create 2 records'() {
    return using(new XLog(OptimisticLockTest.logger, levels.INFO, 'should create 2 records'), (log) => {
      const item1 = this.createItem();
      const item2 = this.createItem();

      return Promise.all([this.service.create(item1), this.service.create(item2)]).then((items) => {
        log.log(`items created: ${JSON.stringify(items)}`);
      });
    });
  }


  @test 'should update 2 records'(done: (err?: any) => void) {
    using(new XLog(OptimisticLockTest.logger, levels.INFO, 'should update 2 records'), (log) => {
      this.service.find().then((items) => {
        const item = items[items.length - 1];
        const itemClone = Clone.clone(item);

        item.__test = 5000;

        // update für denselben Record ohne und mit delay von 5 s -> optimistic lock exception
        this.service.update(itemClone).then((itClone) => {
          this.service.update(item).then((it) => {
            // ok
          }).catch((err) => {
            expect(err).to.be.instanceOf(OptimisticLockException);
            done();
          });

        });
      });

      // this.service.findById(this.maxId).then((item) => {
      //   item.__test = 5000;

      //   // update für Record mit delay von 5 s
      //   this.service.update(item).then((it) => {
      //     log.log(`item1 updated: ${JSON.stringify(it)}`);
      //   });
      // });

      // this.service.findById(this.maxId).then((item) => {
      //   // update für Record ohne delay
      //   this.service.update(item).then((it) => {
      //     log.log(`item1 updated: ${JSON.stringify(it)}`);
      //   });
      // });

      //
      // ersten Record persistieren mit delay von 5ms
      //
      // this.service.create(item1).then((item) => {
      //   log.log(`item1 created: ${JSON.stringify(item)}`);
      //   const x = item.name;

      //   item.__test = 5000;

      //   this.service.update(item).then((it) => {
      //     log.log(`item1 updated: ${JSON.stringify(it)}`);
      //   });

      // });

      // // setTimeout(() => {
      // const item2 = Clone.clone(item1);
      // item1.__test = 5000;

      // this.service.update(item1).then((item) => {
      //   log.log(`item1 updated: ${JSON.stringify(item)}`);
      // });

      // this.service.update(item2).then((item) => {
      //   log.log(`item2 updated: ${JSON.stringify(item)}`);
      // });

      // // }, 2000);
    });
  }
}