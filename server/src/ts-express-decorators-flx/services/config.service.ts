import * as Knex from 'knex';

import { Service } from 'ts-express-decorators';

// -------------------------------------- logging --------------------------------------------
// tslint:disable-next-line:no-unused-variable
import { getLogger, ILogger, levels, using, XLog } from '@fluxgate/platform';
// -------------------------------------- logging --------------------------------------------

import {
  ConfigBase, CreateResult, DeleteResult, FindByIdResult,
  FindResult, IStatusQuery, ISystemConfig, QueryResult,
  StatusFilter, StatusQuery, TableMetadata, UpdateResult
} from '@fluxgate/common';
import {
  Assert, Funktion, JsonSerializer, NotSupportedException,
  SelectorTerm
} from '@fluxgate/core';

import { ISessionRequest } from '../session/session-request.interface';
import { KnexService } from './knex.service';
import { MetadataService } from './metadata.service';
import { ServiceCore } from './service-core';
import { SystemConfigService } from './system-config.service';

/**
 * Klasse zum Ermitteln einer Systemkonfiguration für einen gegebenen Typ und eine Id
 * mittels @see{SystemConfigService}.
 *
 * Die Konfiguration liegt in der Entity SystemConfig als JSON-String eines
 * serialisierten Objekts vor. Die Id in SystemConfig ist eine Kombination aus (type-id) der
 * ConfigBase-Instanz.
 *
 * @export
 * @class ConfigService
 */
@Service()
export class ConfigService extends ServiceCore {
  protected static readonly logger = getLogger(ConfigService);

  private serializer: JsonSerializer = new JsonSerializer();


  public constructor(private systemConfigService: SystemConfigService,
    private knexService: KnexService, private metadataService: MetadataService) {
    super();
    Assert.notNull(systemConfigService);
    Assert.notNull(knexService);
    Assert.notNull(metadataService);
  }


  /**
   * Liefert für den Typ @param{type} und die Id @param{id} die zugehörige Systemconfiguration
   * mit Hilfe des Services @see{SystemConfigService}.
   *
   * @template T - Konfigurationstyp
   * @param {ISessionRequest} request - der REST-Request
   * @param {string} id - Id der Konfiguration ('z.B. 'default')
   * @returns {Promise<FindByIdResult<T, string>>} - Promise
   * @memberof ConfigService
   */
  public findById<T extends ConfigBase>(request: ISessionRequest, id: string):
    Promise<FindByIdResult<T, string>> {
    Assert.notNullOrEmpty(id);

    return using(new XLog(ConfigService.logger, levels.INFO, 'findById', `id = ${id}`), (log) => {
      return new Promise<FindByIdResult<T, string>>((resolve, reject) => {

        this.systemConfigService.findById<ISystemConfig>(request, id)
          .then((result) => {
            const config = this.deserialize<T>(JSON.parse(result.item.json));
            this.updateConfigFromSystemConfig(config, result.item);
            resolve(new FindByIdResult(config, result.entityVersion));
          })
          .catch((err) => {
            reject(err);
          });
      });
    });
  }


  /**
   * find() wird auf query abgebildet.
   *
   * @template T
   * @param {ISessionRequest} request
   * @param {string} model - Name der Konfigurationsklasse (z.B. 'SmtpConfig')
   * @param {StatusFilter} [filter]
   * @returns {Promise<FindResult<T>>}
   * @memberof ConfigService
   */
  public find<T extends ConfigBase>(request: ISessionRequest, filter?: StatusFilter):
    Promise<FindResult<T>> {
    return using(new XLog(ConfigService.logger, levels.INFO, 'find'), (log) => {
      return new Promise<FindResult<T>>((resolve, reject) => {

        this.systemConfigService.find(request, filter)
          .then((findResult) => {
            const result = findResult.items.map((item) => {
              const config = this.deserialize<T>(JSON.parse(item.json));
              this.updateConfigFromSystemConfig(config, item);
              return config;
            });
            resolve(new FindResult(result, findResult.entityVersion));
          })
          .catch((err) => {
            reject(err);
          });
      });
    });
  }


  public query<T extends ConfigBase>(
    request: ISessionRequest,
    query: IStatusQuery
  ): Promise<QueryResult<ConfigBase>> {
    return using(new XLog(ConfigService.logger, levels.INFO, 'query'), (log) => {
      return new Promise<QueryResult<T>>((resolve, reject) => {

        this.systemConfigService.query(request, query)
          .then((queryResult) => {
            const result = queryResult.items.map((item) => {
              const config = this.deserialize<T>(JSON.parse(item.json));
              this.updateConfigFromSystemConfig(config, item);
              return config;
            });
            resolve(new QueryResult(result, queryResult.entityVersion));
          })
          .catch((err) => {
            reject(err);
          });
      });
    });
  }


  /**
   * Entfernt alle Testdaten (Id beginnt mit '@')
   *
   * @param prefix
   */
  public deleteTestdata(
    prefix: string = '%'
  ): any {
    return this.systemConfigService
      .fromTable()
      .where(this.systemConfigService.idColumnName, 'like', ConfigBase.createId(prefix, '@%'))
      .delete();
  }


  public create<T extends ConfigBase>(
    request: ISessionRequest,
    subject: ConfigBase
  ): Promise<CreateResult<T, string>> {
    return using(new XLog(ConfigService.logger, levels.INFO, 'create', `[${subject.constructor.name}]`), (log) => {
      if (log.isDebugEnabled) {
        log.debug('subject: ', subject);
      }

      return new Promise<CreateResult<ConfigBase, string>>((resolve, reject) => {
        const systemConfig: ISystemConfig = this.createSystemConfigFromConfig(subject);

        this.systemConfigService.create(request, systemConfig)
          .then((result) => {
            const config = this.deserialize<T>(JSON.parse(result.item.json));
            this.updateConfigFromSystemConfig(config, result.item);
            resolve(new CreateResult(config, result.entityVersion));
          })
          .catch((err) => {
            reject(err);
          });
      });
    });
  }


  public update<T extends ConfigBase>(
    request: ISessionRequest,
    subject: ConfigBase
  ): Promise<UpdateResult<T, string>> {
    return using(new XLog(ConfigService.logger, levels.INFO, 'update', `[${subject.constructor.name}]`), (log) => {
      if (log.isDebugEnabled) {
        log.debug('subject: ', subject);
      }

      return new Promise<UpdateResult<ConfigBase, string>>((resolve, reject) => {
        this.knexService.knex.transaction((trx) => {

          const systemConfig: ISystemConfig = this.createSystemConfigFromConfig(subject);

          this.systemConfigService.findById<ISystemConfig>(request, systemConfig.id, trx)
            .then((findByIdResult) => {
              systemConfig.__version = findByIdResult.item.__version;

              this.updateSystemConfigFromConfig(systemConfig, subject);

              this.systemConfigService.update(request, systemConfig, trx)
                .then((result) => {
                  const config = this.deserialize<T>(JSON.parse(result.item.json));
                  this.updateConfigFromSystemConfig(config, result.item);

                  trx.commit();
                  resolve(new UpdateResult(config, result.entityVersion));
                })
                .catch((err) => {
                  reject(err);
                });
            }).catch((err) => {
              trx.rollback();
            });

        });
      });
    });
  }


  public delete(
    request: ISessionRequest,
    id: string
  ): Promise<DeleteResult<string>> {
    return using(new XLog(ConfigService.logger, levels.INFO, 'delete', `id = ${id}`), (log) => {

      return new Promise<DeleteResult<string>>((resolve, reject) => {
        return this.systemConfigService.delete(request, id)
          .then((deleteResult) => {
            resolve(deleteResult);
          })
          .catch((err) => {
            reject(err);
          });
      });
    });
  }

  public queryKnex(
    request: ISessionRequest,
    query: Knex.QueryBuilder,
    filter?: StatusFilter,
    trxExisting?: Knex.Transaction
  ): Promise<QueryResult<ConfigBase>> {
    throw new NotSupportedException();
  }

  public get idColumnName(): string {
    return this.systemConfigService.idColumnName;
  }

  public set idColumnName(value: string) {
    // ok
  }

  public get tableName(): string {
    return this.systemConfigService.tableName;
  }

  public get metadata(): TableMetadata {
    return this.systemConfigService.metadata;
  }

  public fromTable(table?: string | Funktion): Knex.QueryBuilder {
    throw new NotSupportedException();
  }

  protected deserialize<T>(json: any): T {
    Assert.notNull(json);
    return this.serializer.deserialize<T>(json);
  }

  protected serialize<T>(item: T): any {
    Assert.notNull(item);
    return this.serializer.serialize(item);
  }

  private createSystemConfigFromConfig(config: ConfigBase): ISystemConfig {
    const systemConfig: ISystemConfig = {
      id: config.id,
      __client: config.__client,
      __version: undefined,
      type: config.type,
      description: config.description,
      json: JSON.stringify(this.serialize(config))                // muss JSON.stringify bleiben
    };

    return systemConfig;
  }


  private updateSystemConfigFromConfig(systemConfig: ISystemConfig, config: ConfigBase) {
    systemConfig.description = config.description;
    systemConfig.json = JSON.stringify(this.serialize(config));    // muss JSON.stringify bleiben
  }

  private updateConfigFromSystemConfig(config: ConfigBase, systemConfig: ISystemConfig) {
    config.__version = systemConfig.__version;
    config.__client = systemConfig.__client;
  }
}