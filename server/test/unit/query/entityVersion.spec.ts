// tslint:disable:member-access
// tslint:disable:max-classes-per-file

// tslint:disable-next-line:no-var-requires
require('reflect-metadata');

import * as chai from 'chai';
import { expect } from 'chai';
import * as chaiAsPromised from 'chai-as-promised';
import 'mocha';
// tslint:disable-next-line:no-unused-variable
import { suite, test } from 'mocha-typescript';


// Chai mit Promises verwenden (... to.become() ... etc.)
chai.use(chaiAsPromised);
chai.should();

// -------------------------- logging -------------------------------
// tslint:disable-next-line:no-unused-variable
import { getLogger, ILogger, levels, using, XLog } from '@fluxgate/platform';
// -------------------------- logging -------------------------------

import { ConstantValueGenerator, EntityVersion, NumberIdGenerator } from '@fluxgate/common';

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


  public static before(done: (err?: any) => void) {
    using(new XLog(EntityVersionTest.logger, levels.INFO, 'static.before'), (log) => {
      super.before((doneBefore: (err?: any) => void) => {
        super.setup(QueryTest, QueryTestService, new NumberIdGenerator(1), (doneSetup: (err?: any) => void) => {
          done();
        });
      });
    });
  }


  @test 'should create new record -> version == 0'() {
    const item1 = this.createItem();

    return expect(this.service.create(item1).then((result) => result.item.__version)).to.eventually.equal(0);
  }


  @test 'should increment entity version && entityVersion.version (1st update)'(done: (err?: any) => void) {
    this.service.find().then((findResult) => {
      const item = findResult.items[findResult.items.length - 1];   // new record

      item.name = item.name + '-updated';

      this.entityVersionService.findById<EntityVersion>('querytest').then((entityVersionResult) => {
        const versionPrev = entityVersionResult.item.__version;

        this.service.update(item).then((updateResult) => {
          const expectedVersion = 1;
          if (updateResult.item.__version !== expectedVersion) {
            done(`entity: version (${updateResult.item.__version}) not ${expectedVersion} after first update`);
            return;
          }

          if (updateResult.item.__version !== item.__version + 1) {
            done(`entity: versions different: ${updateResult.item.__version} !== ${item.__version}`);
            return;
          }

          this.entityVersionService.findById<EntityVersion>('querytest').then((evResult) => {
            if (evResult.item.__version !== versionPrev + 1) {
              done(`entityVersion: versions different: ${evResult.item.__version} !== ${versionPrev + 1}`);
            } else {
              done();
            }

          });
        });
      });
    });
  }


  @test 'should increment entity version && entityVersion.version (2nd update)'(done: (err?: any) => void) {
    this.service.find().then((findResult) => {
      const item = findResult.items[findResult.items.length - 1];   // new record

      item.name = item.name + '-updated';

      this.entityVersionService.findById<EntityVersion>('querytest').then((entityVersionResult) => {
        const versionPrev = entityVersionResult.item.__version;

        this.service.update(item).then((updateResult) => {
          if (updateResult.item.__version !== item.__version + 1) {
            done(`entity: version (${updateResult.item.__version}) not ${item.__version + 1} after first update`);
            return;
          }

          if (updateResult.entityVersion !== versionPrev + 1) {
            done(`entityVersion: version different to previous version: ` +
              `${updateResult.entityVersion} !== ${versionPrev + 1}`);
            return;
          }

          this.entityVersionService.findById<EntityVersion>('querytest').then((evResult) => {

            if (updateResult.entityVersion !== evResult.item.__version) {
              done(`entityVersion: versions different: ${updateResult.entityVersion} !== ${evResult.item.__version}`);
            } else {
              done();
            }

          });
        });
      });
    });
  }
}