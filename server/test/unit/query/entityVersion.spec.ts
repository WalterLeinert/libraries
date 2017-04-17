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

import { EntityVersionService } from '../../../src/ts-express-decorators-flx/services/entityVersion.service';
import { KnexTest } from '../knexTest.spec';
import { QueryTest } from './query-test';
import { QueryTestService } from './query-test.service';


@suite('test entityversion table')
class EntityVersionTest extends KnexTest<QueryTest, number> {
  protected static readonly logger = getLogger(EntityVersionTest);

  public static readonly ITEMS = 5;
  public static readonly MAX_ITEMS = 10;
  private entityVersionService: EntityVersionService;


  constructor() {
    super({
      modelClass: QueryTest,
      count: EntityVersionTest.ITEMS,
      maxCount: EntityVersionTest.MAX_ITEMS,
      idGenerator: new NumberIdGenerator(EntityVersionTest.MAX_ITEMS),
      columnConfig: {
        __version: new ConstantValueGenerator(0),
        __test: new ConstantValueGenerator(0),
      }
    });

    this.entityVersionService = KnexTest.createService(EntityVersionService);
  }


  public static before(done: () => void) {
    using(new XLog(EntityVersionTest.logger, levels.INFO, 'static.before'), (log) => {
      super.before(() => {

        super.setup(QueryTest, QueryTestService, new NumberIdGenerator(1), () => {
          done();
        });
      });
    });
  }


  @test 'should create new record -> version == 0'() {
    const item1 = this.createItem();

    expect(this.service.create(item1).then((it) => it.__version)).to.become(0);
  }


  @test 'should increment entity version && entityVersion.version'(done: () => void) {
    this.service.find().then((items) => {
      const item = items[items.length - 1];   // new record

      item.name = item.name + '-updated';

      this.entityVersionService.findById('querytest').then((version) => {
        const versionPrev = version.__version;

        this.service.update(item).then((it) => {

          expect(it.__version).to.equal(item.__version + 1);

          this.entityVersionService.findById('querytest').then((ev) => {
            expect(ev.__version).to.equal(versionPrev + 1);

            done();
          });
        });
      });
    });
  }

  // @test 'should update record -> version == 2'(done: () => void) {
  //   this.service.find().then((items) => {
  //     const item = items[items.length - 1];   // new record

  //     item.name = item.name + '-updated2';

  //     this.entityVersionService.findById('querytest').then((version) => {
  //       const versionPrev = version.__version;

  //       expect(this.service.update(item).then((it) => it.__version)).to.become(1);
  //       expect(this.entityVersionService.findById('querytest').then((ev) => ev.__version)).to.become(versionPrev + 1);

  //       done();
  //     });
  //   });
  // }

}