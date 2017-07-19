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

import {
  ConstantValueGenerator, EntityVersion,
  NumberIdGenerator, QueryTest
} from '@fluxgate/common';

import { EntityVersionService } from '../../../src/ts-express-decorators-flx/services/entityVersion.service';
import { EntityVersionTestBase } from '../entity-version-test-base';
import { KnexTest } from '../knex-test';
import { QueryTestService } from './query-test.service';


/**
 * Test mit EntityVersionTest-Konfiguration:
 * - EntityVersion-Tabelle muss involviert sein und bei Änderungen inkrementiert werden
 *
 * @class EntityVersionTest
 * @extends {KnexTest<QueryTest, number>}
 */
@suite('test entityversion table')
class EntityVersionTest extends EntityVersionTestBase<QueryTest, number> {
  protected static readonly logger = getLogger(EntityVersionTest);

  public static readonly ITEMS = 5;
  public static readonly MAX_ITEMS = 10;
  private entityVersionService: EntityVersionService;


  constructor() {
    super({
      count: EntityVersionTest.ITEMS,
      maxCount: EntityVersionTest.MAX_ITEMS,
      idGenerator: new NumberIdGenerator(EntityVersionTest.MAX_ITEMS),
      columns: {
        __version: new ConstantValueGenerator(0),
        __status: new ConstantValueGenerator(0),
        __test: new ConstantValueGenerator(0),
      },
      tableMetadata: KnexTest.metadataService.findTableMetadata(QueryTest)
    });

    this.entityVersionService = KnexTest.createService(EntityVersionService);
  }


  public static before(done: (err?: any) => void) {
    using(new XLog(EntityVersionTest.logger, levels.INFO, 'static.before'), (log) => {
      super.before((doneBefore: (err?: any) => void) => {
        super.setup(QueryTestService, new NumberIdGenerator(1), (doneSetup: (err?: any) => void) => {
          done();
        });
      });
    });
  }


  @test 'should create new record -> version == 0, increment entityVersion'(done: (err?: any) => void) {
    const item1 = this.createItem();
    this.entityVersionService.findById<EntityVersion>(undefined, 'querytest').then((entityVersionResult) => {
      const versionPrev = entityVersionResult.item.__version;

      this.service.create(undefined, item1).then((result) => {
        if (result.item.__version !== 0) {
          done(`entity: initial version (${result.item.__version}) not 0`);
        }

        this.entityVersionService.findById<EntityVersion>(undefined, 'querytest').then((evResult) => {
          if (evResult.item.__version !== versionPrev + 1) {
            done(`entityVersion: versions different: ${evResult.item.__version} !== ${versionPrev + 1}`);
          } else {
            done();
          }
        });
      });
    });
  }


  @test 'should increment entity version && entityVersion.version (1st update)'(done: (err?: any) => void) {
    this.service.find(undefined).then((findResult) => {
      const item = findResult.items[findResult.items.length - 1];   // new record

      item.name = item.name + '-updated';

      this.entityVersionService.findById<EntityVersion>(undefined, 'querytest').then((entityVersionResult) => {
        const entityVersionPrev = entityVersionResult.item.__version;

        this.service.update(undefined, item).then((updateResult) => {
          const expectedVersion = 1;
          if (updateResult.item.__version !== expectedVersion) {
            done(`entity: version (${updateResult.item.__version}) not ${expectedVersion} after first update`);
            return;
          }

          if (updateResult.item.__version !== item.__version + 1) {
            done(`entity: versions different: ${updateResult.item.__version} !== ${item.__version}`);
            return;
          }

          this.entityVersionService.findById<EntityVersion>(undefined, 'querytest').then((evResult) => {
            if (evResult.item.__version !== entityVersionPrev + 1) {
              done(`entityVersion: versions different: ${evResult.item.__version} !== ${entityVersionPrev + 1}`);
              return;
            }

            done();
          });
        });
      });
    });
  }


  @test 'should increment entity version && entityVersion.version (2nd update)'(done: (err?: any) => void) {
    this.service.find(undefined).then((findResult) => {
      const item = findResult.items[findResult.items.length - 1];   // new record

      item.name = item.name + '-updated';

      this.entityVersionService.findById<EntityVersion>(undefined, 'querytest').then((entityVersionResult) => {
        const entityVersionPrev = entityVersionResult.item.__version;

        this.service.update(undefined, item).then((updateResult) => {
          if (updateResult.item.__version !== item.__version + 1) {
            done(`entity: version (${updateResult.item.__version}) not ${item.__version + 1} after first update`);
            return;
          }

          if (updateResult.entityVersion !== entityVersionPrev + 1) {
            done(`entityVersion: version different to previous version: ` +
              `${updateResult.entityVersion} !== ${entityVersionPrev + 1}`);
            return;
          }

          this.entityVersionService.findById<EntityVersion>(undefined, 'querytest').then((evResult) => {
            if (evResult.item.__version !== entityVersionPrev + 1) {
              done(`entityVersion: versions different: ${evResult.item.__version} !== ${entityVersionPrev + 1}`);
              return;
            }

            // prüfen, ob der delete call die korrekte EntityVersion liefert
            if (updateResult.entityVersion !== evResult.item.__version) {
              done(`entityVersion: result version different: ` +
                `${updateResult.entityVersion} !== ${evResult.item.__version}`);
              return;
            }

            done();
          });
        });
      });
    });
  }



  @test 'should delete record -> increment entityVersion'(done: (err?: any) => void) {
    this.service.find(undefined).then((findResult) => {
      const item = findResult.items[findResult.items.length - 1];   // new record

      this.entityVersionService.findById<EntityVersion>(undefined, 'querytest').then((entityVersionResult) => {
        const entityVersionPrev = entityVersionResult.item.__version;

        this.service.delete(undefined, item.id).then((deleteResult) => {

          this.entityVersionService.findById<EntityVersion>(undefined, 'querytest').then((evResult) => {
            if (evResult.item.__version !== entityVersionPrev + 1) {
              done(`entityVersion: versions different: ${evResult.item.__version} !== ${entityVersionPrev + 1}`);
              return;
            }

            // prüfen, ob der delete call die korrekte EntityVersion liefert
            if (deleteResult.entityVersion !== evResult.item.__version) {
              done(`entityVersion: result version different: (${deleteResult.entityVersion}) not ` +
                `${evResult.item.__version} after deletion`);
              return;
            }

            done();
          });
        });
      });
    });
  }

}