// tslint:disable:member-access
// tslint:disable:max-classes-per-file

// tslint:disable-next-line:no-var-requires
require('reflect-metadata');

import * as chai from 'chai';
import * as chaiAsPromised from 'chai-as-promised';
import 'mocha';
// tslint:disable-next-line:no-unused-variable
import { only, suite, test } from 'mocha-typescript';


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

      return Promise.all([
        this.service.create(undefined, item1),
        this.service.create(undefined, item2)]).then((items) => {
          // ok
        });
    });
  }


  @test 'should generate optimistic lock exception'(done: (err?: any) => void) {
    using(new XLog(OptimisticLockTest.logger, levels.INFO, 'should update 2 records'), (log) => {
      this.service.find(undefined).then((findResult) => {
        const item = findResult.items[findResult.items.length - 1];
        const itemClone = Clone.clone(item);

        // update für denselben Record direkt nacheinander -> optimistic lock exception
        this.service.update(undefined, itemClone).then((firstUpdateResult) => {
          // erster update war erfolgreich -> version = 1
          this.service.update(undefined, item).then((secondUpdateResult) => {
            //  2. update schlägt fehl
            done(`should not happen`);
          }).catch((err) => {
            if (err instanceof OptimisticLockException) {
              done();
            } else {
              done(`${err}: OptimisticLockException expected`);
            }
          });
        });

      });
    });
  }
}