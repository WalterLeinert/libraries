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
import { getLogger, ILogger, levels, using, XLog } from '@fluxgate/common';
// -------------------------- logging -------------------------------

import { Clone, ConstantValueGenerator, EntityGenerator, NumberIdGenerator, Utility } from '@fluxgate/common';


import { BaseService } from '../../../src/ts-express-decorators-flx/services/base.service';
import { KnexTest } from '../knexTest.spec';
import { QueryTest } from './query-test';
import { QueryTestService } from './query-test.service';




@suite('test optimistic locking')
class OptimisticLockTest extends KnexTest {
  protected static readonly logger = getLogger(OptimisticLockTest);

  public static readonly ITEMS = 5;
  public static readonly MAX_ITEMS = 10;

  private static _maxId: number = 0;
  private static _service: BaseService<QueryTest, number>;

  private entityGenerator: EntityGenerator<QueryTest, number>;
  private testItems: QueryTest[];

  constructor() {
    super();

    this.entityGenerator = new EntityGenerator<QueryTest, number>({
      count: OptimisticLockTest.ITEMS,
      maxCount: OptimisticLockTest.MAX_ITEMS,
      tableMetadata: KnexTest.metadataService.findTableMetadata(QueryTest),
      idGenerator: new NumberIdGenerator(OptimisticLockTest.MAX_ITEMS),
      columns: {
        __version: new ConstantValueGenerator(0),
        __test: new ConstantValueGenerator(0),
      }
    });

    this.testItems = this.entityGenerator.generate();
  }


  public static before() {
    using(new XLog(OptimisticLockTest.logger, levels.INFO, 'static.before'), (log) => {
      super.before();

      OptimisticLockTest._service = KnexTest.createService(QueryTestService);

      // max. bisherige id ermitteln
      OptimisticLockTest._service.find()
        .then((roles) => {
          const ids = roles.map((item) => item.id);

          if (!Utility.isNullOrEmpty(ids)) {
            OptimisticLockTest._maxId = Math.max(...ids);
          }

          log.info(`maxId = ${OptimisticLockTest._maxId}`);
        });
    });
  }

  public static after() {
    return using(new XLog(OptimisticLockTest.logger, levels.INFO, 'static.after'), (log) => {

      log.info(`maxId = ${OptimisticLockTest._maxId}`);

      // alle Testrollen löschen
      OptimisticLockTest._service.queryKnex(
        OptimisticLockTest._service
          .fromTable()
          .where(OptimisticLockTest._service.idColumnName, '>=', OptimisticLockTest._maxId + 1)
        // .delete()
      ).then((rowsAffected) => {
        super.after();
      });
    });
  }


  @test 'should create 2 records'() {
    using(new XLog(OptimisticLockTest.logger, levels.INFO, 'should create 2 records'), (log) => {
      const item1 = this.entityGenerator.createItem();
      const item2 = this.entityGenerator.createItem();

      Promise.all([this.service.create(item1), this.service.create(item2)]).then((items) => {
        log.log(`items created: ${JSON.stringify(items)}`);

        const ids = items.map((item) => item.id);
        if (!Utility.isNullOrEmpty(ids)) {
          OptimisticLockTest._maxId = Math.max(...ids);
          log.info(`maxId = ${OptimisticLockTest._maxId}`);
        }
      });
    });
  }


  @test 'should update 2 records'() {
    using(new XLog(OptimisticLockTest.logger, levels.INFO, 'should update 2 records'), (log) => {
      this.service.find().then((items) => {
        const item = items[0];
        const itemClone = Clone.clone(item);

        item.__test = 5000;

        // update für Record mit delay von 5 s
        this.service.update(item).then((it) => {
          log.log(`item1 updated: id = ${it.id}, ${JSON.stringify(it)}`);
        });


        itemClone.__test = 0;

        // update für Record mit delay von 5 s
        // this.service.update(itemClone).then((it) => {
        //   log.log(`itemClone updated: id = ${it.id}, ${JSON.stringify(it)}`);
        // });

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

  private get service(): BaseService<QueryTest, number> {
    return OptimisticLockTest._service;
  }

  private get maxId(): number {
    return OptimisticLockTest._maxId;
  }

}