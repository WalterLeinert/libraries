import path = require('path');
// tslint:disable-next-line:no-var-requires
import 'reflect-metadata';

import * as Knex from 'knex';

// -------------------------- logging -------------------------------
// tslint:disable-next-line:no-unused-variable
import { getLogger, ILogger, levels, using, XLog } from '@fluxgate/platform';
// -------------------------- logging -------------------------------

import {
  ConfigBase, EntityGenerator, EntityVersion, IEntity,
  IEntityGeneratorConfig, TableMetadata, ValueGenerator
} from '@fluxgate/common';
import { Activator, Core, Dictionary, fromEnvironment, Funktion, ICtor, IToString, Types } from '@fluxgate/core';
import { JsonReader } from '@fluxgate/node';

import { IBaseService, IBaseServiceRaw } from '../../lib/ts-express-decorators-flx/services/baseService.interface';
import { ConfigService } from '../../lib/ts-express-decorators-flx/services/config.service';
import { KnexService } from '../../lib/ts-express-decorators-flx/services/knex.service';
import { MetadataService } from '../../lib/ts-express-decorators-flx/services/metadata.service';
import { SystemConfigService } from '../../lib/ts-express-decorators-flx/services/system-config.service';

import { ServerUnitTest } from '../unit-test';


/**
 * Basisklasse für alle Service-Klassen, die mit Knex auf die DB zugreifen.
 */
export abstract class KnexTest<T extends IEntity<TId>, TId extends IToString> extends ServerUnitTest {
  protected static readonly logger = getLogger(KnexTest);

  private static _knexService: KnexService;
  private static _metadataService: MetadataService;
  private static _service: IBaseServiceRaw;
  private static _configService: ConfigService;
  private static _entityVersionMetadata: TableMetadata;

  /**
   * Id der ersten Test-Entity (ab dieser werden am Testende alle Entities gelöscht)
   */
  private static _firstTestId: number = 0;
  private static _firstConfigTestId: string = '';


  // tslint:disable-next-line:no-unused-variable
  // tslint:disable-next-line:variable-name
  private static ___initialize = (() => {
    KnexTest._firstTestId = 0;

    KnexTest._knexService = new KnexService();
    KnexTest._metadataService = new MetadataService();
    KnexTest._entityVersionMetadata = KnexTest._metadataService.findTableMetadata(EntityVersion);
  })();


  private entityGenerator: EntityGenerator<T, TId>;
  private _generatedItems: T[];
  private entityVersionDict: Dictionary<string, number> = new Dictionary<string, number>();

  /**
   * Creates an instance of KnexTest.
   *
   * @param {IKnexGeneratorConfig<TId>} [generatorConfig] - wird nur benötigt, falls im Test mit dem Generator
   * gearbeitet werden soll.
   *
   * @memberOf KnexTest
   */
  constructor(generatorConfig?: IEntityGeneratorConfig) {
    super();

    using(new XLog(KnexTest.logger, levels.INFO, 'ctor'), (log) => {
      if (generatorConfig) {
        this.entityGenerator = new EntityGenerator<T, TId>(generatorConfig);

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
  protected static setup<TSetupId>(serviceClass: ICtor<IBaseServiceRaw>,
    generatorConfig: IEntityGeneratorConfig | ValueGenerator<any>,
    done: (err?: any) => void) {
    using(new XLog(KnexTest.logger, levels.INFO, 'static.setup'), (log) => {
      KnexTest._service = KnexTest.createService(serviceClass);

      if (Types.isPresent(generatorConfig)) {

        let config: IEntityGeneratorConfig;

        if (generatorConfig instanceof ValueGenerator) {
          config = {
            count: 1,
            maxCount: 1,
            idGenerator: generatorConfig,
            tableMetadata: KnexTest._service.metadata
          };
        } else {
          config = generatorConfig;
        }

        /**
         * eine EntityGenerator erzeugen, der genau ein Item erzeugen kann.
         */
        const eg = new EntityGenerator(config);

        /**
         * ein neues Item erzeugen und wieder löschen, damit wir die Id erhalten (-> _firstTestId),
         * ab der wir alle Test-Items löschen können
         */
        const item = eg.createItem();
        KnexTest._service.create(undefined, item).then((result) => {
          log.log(`created temp. entity: id = ${result.item.id}`);

          KnexTest._firstTestId = result.item.id;

          KnexTest._service.delete(undefined, KnexTest._firstTestId).then((rowsAffected) => {
            log.log(`deleted temp. entity: id = ${result.item.id}`);

            done();
          });
        });
      }
    });
  }



  protected static setupConfig<TModelClass extends ConfigBase>(serviceClass: ICtor<ConfigService>,
    modelClass: ICtor<ConfigBase>,
    generatorConfig: IEntityGeneratorConfig | ValueGenerator<any>,
    done: (err?: any) => void) {
    using(new XLog(KnexTest.logger, levels.INFO, 'static.setupConfig'), (log) => {
      const systemConfigService = KnexTest.createService(SystemConfigService);
      KnexTest._configService = new ConfigService(systemConfigService, KnexTest.knexService, KnexTest.metadataService);

      if (Types.isPresent(generatorConfig)) {

        let config: IEntityGeneratorConfig;

        if (generatorConfig instanceof ValueGenerator) {
          config = {
            count: 1,
            maxCount: 1,
            idGenerator: generatorConfig,
            tableMetadata: KnexTest._metadataService.findTableMetadata(modelClass)
          };
        } else {
          config = generatorConfig;
        }

        /**
         * eine EntityGenerator erzeugen, der genau ein Item erzeugen kann.
         */
        const eg = new EntityGenerator<TModelClass, string>(config);

        /**
         * ein neues Item erzeugen und wieder löschen, damit wir die Id erhalten (-> _firstTestId),
         * ab der wir alle Test-Items löschen können
         */
        const item = eg.createItem(true);
        KnexTest._configService.create(undefined, item).then((result) => {
          log.log(`created temp. entity: id = ${result.item.id}`);

          KnexTest._firstConfigTestId = result.item.id;

          KnexTest._configService.delete(undefined, KnexTest._firstConfigTestId)
            .then((rowsAffected) => {
              log.log(`deleted temp. entity: id = ${result.item.id}`);

              done();
            });
        });
      }
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

          const knexConfigPath = path.join(process.cwd(), '/src/test/config/knexfile.json');
          log.log(`knexConfigPath = ${knexConfigPath}`);

          //
          // Konfiguration lesen und in AppRegistry ablegen
          //
          const config = JsonReader.readJsonSync<any>(knexConfigPath);

          const systemEnv = fromEnvironment('NODE_ENV', 'ci');

          log.log(`read knex config from ${knexConfigPath} for systemEnv = ${systemEnv}`);

          const knexConfig: Knex.Config = config[systemEnv];
          KnexService.configure(knexConfig);


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
  protected static after(done: (err?: any) => void) {
    using(new XLog(KnexTest.logger, levels.INFO, 'static.after'), (log) => {

      try {

        const p1 = new Promise<any>((resolve, reject) => {
          if (KnexTest._service) {

            /**
             * alle Entities mit ids >= _firstTestId wieder entfernen
             */
            KnexTest._service.queryKnex(
              undefined,
              KnexTest._service
                .fromTable()
                .where(KnexTest._service.idColumnName, '>=', KnexTest._firstTestId)
                .delete()
            ).then((rowsAffected) => {
              log.log(`deleted test data (id >= ${KnexTest._firstTestId}, res = ${Core.stringify(rowsAffected)}`);
              resolve();
            });
          } else {
            resolve();
          }
        });

        const p2 = new Promise<any>((resolve, reject) => {
          if (KnexTest._configService) {

            /**
             * alle Entities mit ids >= _firstTestId wieder entfernen
             */
            KnexTest._configService.deleteTestdata()
              .then((rowsAffected: number) => {
                log.log(`deleted test data, res = ${Core.stringify(rowsAffected)}`);
                resolve();
              });
          } else {
            resolve();
          }
        });


        Promise.all([p1, p2]).then((res) => {
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
  protected before(done?: (err?: any) => void) {
    using(new XLog(KnexTest.logger, levels.INFO, 'before'), (log) => {
      super.before(() => {
        this.entityVersionDict.clear();

        KnexTest._knexService.knex.table(KnexTest._entityVersionMetadata.tableName)
          .then((entityVersions: any[]) => {

            // aktuelle EntityVersions ermitteln und für Tests in Dictionary ablegen
            entityVersions.forEach((entityVersion) => {
              const entity = entityVersion[KnexTest._entityVersionMetadata.primaryKeyColumn.options.name] as string;
              const version = entityVersion[KnexTest._entityVersionMetadata.versionColumn.options.name] as number;

              this.entityVersionDict.set(entity, version);
            });

            done();
          });
      });
    });
  }

  /**
   * wird nach jedem Test aufgerufen
   */
  protected after(done?: (err?: any) => void) {
    using(new XLog(KnexTest.logger, levels.INFO, 'after'), (log) => {
      super.after(() => {
        done();
      });
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
  protected static createService<TService>(model: ICtor<TService>): TService {
    return Activator.createInstance<TService>(model, KnexTest.knexService, KnexTest.metadataService);
  }

  protected static get knexService(): KnexService {
    return KnexTest._knexService;
  }

  protected get service(): IBaseService<T, TId> {
    return KnexTest._service;
  }

  protected get configService(): ConfigService {
    return KnexTest._configService;
  }

  protected get firstTestId(): number {
    return KnexTest._firstTestId;
  }

  protected get generatedItems(): T[] {
    return this._generatedItems;
  }

  protected getEntityVersionFor(model: Funktion): number {
    const metadata = KnexTest._metadataService.findTableMetadata(model);
    return this.entityVersionDict.get(metadata.tableName);
  }

  protected getNextEntityVersionFor(model: Funktion): number {
    return this.getEntityVersionFor(model) + 1;
  }

}