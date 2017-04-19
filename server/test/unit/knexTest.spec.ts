import path = require('path');
// tslint:disable-next-line:no-var-requires
import 'reflect-metadata';

import * as Knex from 'knex';

// -------------------------- logging -------------------------------
// tslint:disable-next-line:no-unused-variable
import { getLogger, ILogger, levels, using, XLog } from '@fluxgate/platform';
// -------------------------- logging -------------------------------

import {
  BaseTest, EntityGenerator, IEntity, IEntityGeneratorColumnConfig, ValueGenerator
} from '@fluxgate/common';
import { Activator, fromEnvironment, Funktion, ICtor, IToString } from '@fluxgate/core';
import { JsonReader } from '@fluxgate/platform';

import { KnexService, MetadataService } from '../../src/ts-express-decorators-flx/services';
import { IBaseService, IBaseServiceRaw } from '../../src/ts-express-decorators-flx/services/baseService.interface';


export interface IKnexGeneratorConfig<TId> {
  modelClass: Funktion;
  count: number;
  maxCount: number;
  idGenerator: ValueGenerator<TId>;
  columnConfig?: IEntityGeneratorColumnConfig;
}


/**
 * Basisklasse für alle Service-Klassen, die mit Knex auf die DB zugreifen.
 */
export abstract class KnexTest<T extends IEntity<TId>, TId extends IToString> extends BaseTest {
  protected static readonly logger = getLogger(KnexTest);

  private static _knexService: KnexService;
  private static _metadataService: MetadataService;
  private static _service: IBaseServiceRaw;

  /**
   * Id der ersten Test-Entity (ab dieser werden am Testende alle Entities gelöscht)
   */
  private static _firstTestId: number = 0;

  private entityGenerator: EntityGenerator<T, TId>;
  private _generatedItems: T[];

  /**
   * Creates an instance of KnexTest.
   *
   * @param {IKnexGeneratorConfig<TId>} [generatorConfig] - wird nur benötigt, falls im Test mit dem Generator
   * gearbeitet werden soll.
   *
   * @memberOf KnexTest
   */
  constructor(generatorConfig?: IKnexGeneratorConfig<TId>) {
    super();

    using(new XLog(KnexTest.logger, levels.INFO, 'ctor'), (log) => {
      if (generatorConfig) {
        this.entityGenerator = new EntityGenerator<T, TId>({
          count: generatorConfig.count,
          maxCount: generatorConfig.maxCount,
          tableMetadata: KnexTest.metadataService.findTableMetadata(generatorConfig.modelClass),
          idGenerator: generatorConfig.idGenerator,
          columns: generatorConfig.columnConfig
        });

        this._generatedItems = this.entityGenerator.generate();
      }
    });
  }


  /**
   * Initialisiert den Service und ermittelt die erste freie Id (TODO: funktioniert nur bei number-Ids)
   *
   * @protected
   * @static
   * @param {Funktion} modelClass
   * @param {ICtor<IBaseServiceRaw>} serviceClass
   * @param {ValueGenerator<any>} idGenerator
   * @param {() => void} done
   *
   * @memberOf KnexTest
   */
  protected static setup(modelClass: Funktion, serviceClass: ICtor<IBaseServiceRaw>,
    idGenerator: ValueGenerator<any>, done: () => void) {
    using(new XLog(KnexTest.logger, levels.INFO, 'static.setup'), (log) => {
      KnexTest._service = KnexTest.createService(serviceClass);

      /**
       * eine EntityGenerator erzeugen, der genau ein Item erzeugen kann.
       */
      const eg = new EntityGenerator<any, any>({
        count: 1,
        maxCount: 1,
        tableMetadata: KnexTest.metadataService.findTableMetadata(modelClass),
        idGenerator: idGenerator
      });

      /**
       * ein neues Item erzeugen und wieder löschen, damit wir die Id erhalten (-> _firstTestId),
       * ab der wir alle Test-Items löschen können
       */
      const item = eg.createItem();
      KnexTest._service.create(item).then((it) => {
        log.log(`created temp. entity: id = ${it.id}`);

        KnexTest._firstTestId = it.id;

        KnexTest._service.delete(KnexTest._firstTestId).then((rowsAffected) => {
          log.log(`deleted temp. entity: id = ${it.id}`);

          done();
        });
      });

    });
  }


  /**
   * wird einmal vor allen Tests ausgeführt
   * - Knex-Initialisierung
   */
  protected static before(done: (err?: any) => void) {
    using(new XLog(KnexTest.logger, levels.INFO, 'static.before'), (log) => {

      super.before(() => {
        try {
          log.log(`static.before: done`);

          const knexConfigPath = path.join(process.cwd(), '/test/config/knexfile.json');
          log.log(`knexConfigPath = ${knexConfigPath}`);

          //
          // Konfiguration lesen und in AppRegistry ablegen
          //
          const config = JsonReader.readJsonSync<any>(knexConfigPath);

          let systemEnv = fromEnvironment('NODE_ENV', 'development');
          systemEnv = 'local';        // TODO

          log.log(`read knex config from ${knexConfigPath} for systemEnv = ${systemEnv}`);

          const knexConfig: Knex.Config = config[systemEnv];
          KnexService.configure(knexConfig);

          KnexTest._knexService = new KnexService();
          KnexTest._metadataService = new MetadataService();

          done();
        } catch (err) {
          done(err);
        }

      });

    });
  }


  /**
   * wird einmal nach allen Tests ausgeführt
   * - Knex-Cleanup
   */
  protected static after(done: () => void) {
    using(new XLog(KnexTest.logger, levels.INFO, 'static.after'), (log) => {

      try {

        /**
         * alle Entities mit ids >= _firstTestId wieder entfernen
         */
        KnexTest._service.queryKnex(
          KnexTest._service
            .fromTable()
            .where(KnexTest._service.idColumnName, '>=', KnexTest._firstTestId)
            .delete()
        ).then((rowsAffected) => {
          log.log(`deleted test data (id >= ${KnexTest._firstTestId}, res = ${JSON.stringify(rowsAffected)}`);

          KnexTest.knexService.knex.destroy().then(() => {
            log.log(`knex destroy called`);
            done();
          });
        });

      } finally {
        super.after(() => {
          log.log(`static.after: done`);
        });
      }
    });
  }



  /**
   * wird vor jedem Test aufgerufen
   */
  protected before() {
    using(new XLog(KnexTest.logger, levels.INFO, 'before'), (log) => {
      super.before();
    });
  }

  /**
   * wird nach jedem Test aufgerufen
   */
  protected after() {
    using(new XLog(KnexTest.logger, levels.INFO, 'after'), (log) => {
      super.after();
    });
  }

  protected createItem(): T {
    return this.entityGenerator.createItem();
  }

  protected static get metadataService(): MetadataService {
    return KnexTest._metadataService;
  }

  /**
   * Helpermethode zum Erzeugen von Service-Klassen
   */
  protected static createService<T>(model: ICtor<T>): T {
    return Activator.createInstance<T>(model, KnexTest.knexService, KnexTest.metadataService);
  }

  private static get knexService(): KnexService {
    return KnexTest._knexService;
  }

  protected get service(): IBaseService<T, TId> {
    return KnexTest._service;
  }

  protected get firstTestId(): number {
    return KnexTest._firstTestId;
  }

  protected get generatedItems(): T[] {
    return this._generatedItems;
  }

}