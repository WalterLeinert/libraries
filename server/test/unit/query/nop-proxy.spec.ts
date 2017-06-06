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

import { AppConfig, ConstantValueGenerator, EntityVersion, NumberIdGenerator } from '@fluxgate/common';

import { EntityVersionService } from '../../../src/ts-express-decorators-flx/services/entityVersion.service';
import { KnexTest } from '../knexTest.spec';
import { QueryTest } from './query-test';
import { QueryTestService } from './query-test.service';


/**
 * Test mit NopProxy-Konfiguration:
 * - EntityVersion-Tabelle darf nicht involviert sein
 *
 * @class NopProxyTest
 * @extends {KnexTest<QueryTest, number>}
 */
@suite('test NopProxy')
class NopProxyTest extends KnexTest<QueryTest, number> {
  protected static readonly logger = getLogger(NopProxyTest);

  public static readonly ITEMS = 5;
  public static readonly MAX_ITEMS = 10;
  private entityVersionService: EntityVersionService;


  constructor() {
    super({
      count: NopProxyTest.ITEMS,
      maxCount: NopProxyTest.MAX_ITEMS,
      idGenerator: new NumberIdGenerator(NopProxyTest.MAX_ITEMS),
      columns: {
        __version: new ConstantValueGenerator(0),
        __test: new ConstantValueGenerator(0),
      },
      tableMetadata: KnexTest.metadataService.findTableMetadata(QueryTest)
    });

    this.entityVersionService = KnexTest.createService(EntityVersionService);
  }


  public static before(done: (err?: any) => void) {
    using(new XLog(NopProxyTest.logger, levels.INFO, 'static.before'), (log) => {
      super.before((doneBefore: (err?: any) => void) => {
        super.setup(QueryTestService, new NumberIdGenerator(1), (doneSetup: (err?: any) => void) => {
          done();
        });
      });
    });
  }


  public before(done?: (err?: any) => void) {
    super.before(() => {

      // für Tests eine App-Config simulieren
      AppConfig.register(
        {
          url: 'dummy',
          printUrl: 'dummy',
          printTopic: '',
          mode: 'local',
          proxyMode: 'nop'
        }
      );

      done();
    });
  }

  public after(done?: (err?: any) => void) {
    super.after(() => {
      AppConfig.unregister();
      done();
    });

  }


  @test 'should create new record -> version == 0'() {
    const item1 = this.createItem();

    return expect(this.service.create(undefined, item1).then((result) => result.item.__version)).to.eventually.equal(0);
  }


  @test 'should increment entity version (1st update)'(done: (err?: any) => void) {
    this.service.find(undefined).then((findResult) => {
      const item = findResult.items[findResult.items.length - 1];   // new record

      item.name = item.name + '-updated';

      this.entityVersionService.findById<EntityVersion>(undefined, 'querytest').then((entityVersionResult) => {
        const versionPrev = entityVersionResult.item.__version;

        this.service.update(undefined, item).then((updateResult) => {
          const expectedVersion = 1;
          if (updateResult.item.__version !== expectedVersion) {
            done(`entity: version (${updateResult.item.__version}) not ${expectedVersion} after first update`);
            return;
          }

          if (updateResult.item.__version !== item.__version + 1) {
            done(`entity: versions different: ${updateResult.item.__version} !== ${item.__version + 1}`);
            return;
          }

          if (updateResult.entityVersion !== -1) {
            done(`entityVersion: result should have entityVersion -1: ` +
              `${updateResult.entityVersion} !== ${-1}`);
            return;
          }

          // should not increment entityVersion table
          this.entityVersionService.findById<EntityVersion>(undefined, 'querytest').then((evResult) => {
            if (evResult.item.__version !== versionPrev) {
              done(`entityVersion: versions different: ${evResult.item.__version} !== ${versionPrev}`);
            } else {
              done();
            }

          });
        });
      });
    });
  }


  @test 'should increment entity version (2nd update)'(done: (err?: any) => void) {
    this.service.find(undefined).then((findResult) => {
      const item = findResult.items[findResult.items.length - 1];   // new record

      item.name = item.name + '-updated';

      this.entityVersionService.findById<EntityVersion>(undefined, 'querytest').then((entityVersionResult) => {
        const versionPrev = entityVersionResult.item.__version;

        this.service.update(undefined, item).then((updateResult) => {
          if (updateResult.item.__version !== item.__version + 1) {
            done(`entity: version (${updateResult.item.__version}) not ${item.__version + 1} after first update`);
            return;
          }

          if (updateResult.entityVersion !== -1) {
            done(`entityVersion: result should have entityVersion -1: ` +
              `${updateResult.entityVersion} !== ${-1}`);
            return;
          }

          // should not increment entityVersion table
          this.entityVersionService.findById<EntityVersion>(undefined, 'querytest').then((evResult) => {
            if (evResult.item.__version !== versionPrev) {
              done(`entityVersion: versions different: ${evResult.item.__version} !== ${versionPrev}`);
            } else {
              done();
            }
          });

        });
      });
    });
  }
}