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

import { ConstantValueGenerator, EntityGenerator, NumberIdGenerator, Utility } from '@fluxgate/common';


import { BaseService } from '../../../src/ts-express-decorators-flx/services/base.service';
import { KnexTest } from '../knexTest.spec';
import { QueryTest } from './query-test';
import { QueryTestService } from './query-test.service';




@suite('test optimistic locking')
class OptimisticLockTest extends KnexTest {
  protected static readonly logger = getLogger(OptimisticLockTest);

  public static readonly ITEMS = 5;
  public static readonly MAX_ITEMS = 10;

  private service: BaseService<QueryTest, number>;
  private maxRoleId: number = 0;

  constructor() {
    super();

    this.service = KnexTest.createService(QueryTestService);


    const eg = new EntityGenerator<QueryTest, number>({
      count: OptimisticLockTest.ITEMS,
      maxCount: OptimisticLockTest.MAX_ITEMS,
      tableMetadata: KnexTest.metadataService.findTableMetadata(QueryTest),
      idGenerator: new NumberIdGenerator(OptimisticLockTest.MAX_ITEMS)
    });
  }


  public before() {
    using(new XLog(OptimisticLockTest.logger, levels.INFO, 'before'), (log) => {
      super.before();


      // max. bisherige id ermitteln
      this.service.find()
        .then((items) => {
          const ids = items.map((item) => item.id);
          if (!Utility.isNullOrEmpty(ids)) {
            this.maxRoleId = Math.max(...ids);
          }
        });
    });
  }


  public after() {
    super.after();

    this.service.queryKnex(
      this.service.fromTable().where(this.service.idColumnName, '>=',
        this.maxRoleId + 1).delete())
      .then((rowsAffected) => {
        super.after();
      });
  }



  // @test 'should create 2 records'() {
  //   return expect(this.service.find()
  //     .then((roles) => roles.length))
  //     .to.become(3);
  // }


}