import path = require('path');
// tslint:disable-next-line:no-var-requires
import 'reflect-metadata';

import * as Knex from 'knex';

// -------------------------- logging -------------------------------
// tslint:disable-next-line:no-unused-variable
import { getLogger, ILogger, levels, using, XLog } from '@fluxgate/common';
// -------------------------- logging -------------------------------

import {
  Activator, EntityGenerator, fromEnvironment, Funktion, ICtor,
  IEntity, IEntityGeneratorColumnConfig, IToString, JsonReader, Utility, ValueGenerator
} from '@fluxgate/common';

import { KnexService, MetadataService } from '../../src/ts-express-decorators-flx/services';
import { IBaseService, IBaseServiceRaw } from '../../src/ts-express-decorators-flx/services/baseService.interface';

import { BaseTest } from './baseTest.spec';


/**
 * Basisklasse für alle Service-Klassen, die mit Knex auf die DB zugreifen.
 */
export abstract class KnexTest<T extends IEntity<TId>, TId extends IToString> extends BaseTest {
  protected static readonly logger = getLogger(KnexTest);

  private static _knexService: KnexService;
  private static _metadataService: MetadataService;

  private static _maxId: number = 0;
  private static _service: IBaseServiceRaw;

  private entityGenerator: EntityGenerator<T, TId>;
  private _generatedItems: T[];

  constructor(modelClass: Funktion, count: number, maxCount: number,
    idGenerator: ValueGenerator<TId>, columnConfig?: IEntityGeneratorColumnConfig) {
    super();

    using(new XLog(KnexTest.logger, levels.INFO, 'ctor'), (log) => {

      this.entityGenerator = new EntityGenerator<T, TId>({
        count: count,
        maxCount: maxCount,
        tableMetadata: KnexTest.metadataService.findTableMetadata(modelClass),
        idGenerator: idGenerator,
        columns: columnConfig
      });

      this._generatedItems = this.entityGenerator.generate();
    });
  }


  protected static setup(serviceClass: ICtor<IBaseServiceRaw>) {
    using(new XLog(KnexTest.logger, levels.INFO, 'static.setup'), (log) => {
      KnexTest._service = KnexTest.createService(serviceClass);

      // max. bisherige id ermitteln
      KnexTest._service.find()
        .then((items) => {
          const ids = items.map((item) => item.id);

          if (!Utility.isNullOrEmpty(ids)) {
            KnexTest._maxId = Math.max(...ids);
          }

          log.info(`maxId = ${KnexTest._maxId}`);
        });
    });
  }


  /**
   * wird einmal vor allen Tests ausgeführt
   * - Knex-Initialisierung
   */
  protected static before() {
    using(new XLog(KnexTest.logger, levels.INFO, 'static.before'), (log) => {
      super.before();

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
    });

  }


  /**
   * wird einmal nach allen Tests ausgeführt
   * - Knex-Cleanup
   */
  protected static after() {
    using(new XLog(KnexTest.logger, levels.INFO, 'static.after'), (log) => {

      try {
        // alle erzeugten Testitems löschen
        KnexTest._service.queryKnex(
          KnexTest._service
            .fromTable()
            .where(KnexTest._service.idColumnName, '>=', KnexTest._maxId + 1)
            .delete()
        ).then((rowsAffected) => {
          KnexTest.knexService.knex.destroy();
        });

      } finally {
        super.after();
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
  private static createService<T>(model: ICtor<T>): T {
    return Activator.createInstance<T>(model, KnexTest.knexService, KnexTest.metadataService);
  }

  private static get knexService(): KnexService {
    return KnexTest._knexService;
  }

  protected get service(): IBaseService<T, TId> {
    return KnexTest._service;
  }

  protected get maxId(): number {
    return KnexTest._maxId;
  }

  protected get generatedItems(): T[] {
    return this._generatedItems;
  }

}