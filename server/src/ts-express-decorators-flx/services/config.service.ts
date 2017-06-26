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
 * Die Konfiguration liegt in der Entity SystemConfig als JSON-String eines
 * serialisierten Objekts vor. Die Id in SystemConfi ist eine Kombination aus (type-id) der
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
   * @param {string} model - Name der Konfigurationsklasse (z.B. 'SmtpConfig')
   * @param {string} id - Id der Konfiguration ('z.B. 'default')
   * @returns {Promise<FindByIdResult<T, string>>} - Promise
   * @memberof ConfigService
   */
  public findById<T extends ConfigBase>(request: ISessionRequest, model: string, id: string):
    Promise<FindByIdResult<T, string>> {
    Assert.notNullOrEmpty(model);
    Assert.notNullOrEmpty(id);

    return using(new XLog(ConfigService.logger, levels.INFO, 'findById', `[${model}] id = ${id}`), (log) => {
      return new Promise<FindByIdResult<T, string>>((resolve, reject) => {
        const type = this.getConfigType(model);

        this.systemConfigService.findById<ISystemConfig>(request, ConfigBase.createId(type, id))
          .then((result) => {
            resolve(new FindByIdResult(this.deserialize<T>(JSON.parse(result.item.json)), -1));
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
  public find<T extends ConfigBase>(request: ISessionRequest, model: string, filter?: StatusFilter):
    Promise<FindResult<T>> {
    return using(new XLog(ConfigService.logger, levels.INFO, 'find', `[${model}]`), (log) => {
      return new Promise<FindResult<T>>((resolve, reject) => {
        const type = this.getConfigType(model);

        const query = new StatusQuery(new SelectorTerm({
          name: 'id',
          operator: 'like',
          value: ConfigBase.createId(type, '%')
        }), filter);

        this.systemConfigService.query(request, query)
          .then((queryResult) => {
            const result = queryResult.items.map((item) => {
              return this.deserialize<T>(JSON.parse(item.json));
            });
            resolve(new FindResult(result, queryResult.entityVersion));
          });
      });
    });
  }


  public query<T extends ConfigBase>(
    request: ISessionRequest,
    model: string,
    query: IStatusQuery
  ): Promise<QueryResult<ConfigBase>> {
    throw new NotSupportedException();
  }


  public deleteTestdata(
    prefix: string = '%'
  ): any {
    return this.systemConfigService
      .fromTable()
      .where(this.systemConfigService.idColumnName, 'like', ConfigBase.createId(prefix, '%'))
      .delete();
  }


  public create<T extends ConfigBase>(
    request: ISessionRequest,
    model: string,
    subject: ConfigBase
  ): Promise<CreateResult<T, string>> {
    return using(new XLog(ConfigService.logger, levels.INFO, 'create', `[${model}]`), (log) => {
      if (log.isDebugEnabled) {
        log.debug('subject: ', subject);
      }

      return new Promise<CreateResult<ConfigBase, string>>((resolve, reject) => {
        const systemConfig: ISystemConfig = this.createSystemConfigFromConfig(subject);

        this.systemConfigService.create(request, systemConfig)
          .then((result) => {
            resolve(new CreateResult(subject, result.entityVersion));
          });
      });
    });
  }


  public update<T extends ConfigBase>(
    request: ISessionRequest,
    model: string,
    subject: ConfigBase
  ): Promise<UpdateResult<T, string>> {
    return using(new XLog(ConfigService.logger, levels.INFO, 'update', `[${model}]`), (log) => {
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
                  subject.__version = result.item.__version;    // Version übernehmen

                  trx.commit();
                  resolve(new UpdateResult(subject, result.entityVersion));
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
    model: string,
    id: string
  ): Promise<DeleteResult<string>> {
    return using(new XLog(ConfigService.logger, levels.INFO, 'delete', `[${model}] id = ${id}`), (log) => {
      const type = this.getConfigType(model);

      return new Promise<DeleteResult<string>>((resolve, reject) => {
        return this.systemConfigService.delete(null, ConfigBase.createId(type, id))
          .then((deleteResult) => {
            const configId = deleteResult.id.replace(ConfigBase.createId(type, ''), '');
            resolve(new DeleteResult(configId, deleteResult.entityVersion));
          });
      });
    });
  }


  public getMetadata(model: string | Funktion): TableMetadata {
    return this.metadataService.findTableMetadata(model);
  }

  protected deserialize<T>(json: any): T {
    Assert.notNull(json);
    return this.serializer.deserialize<T>(json);
  }

  private getConfigType(model: string): string {
    const typeColumn = this.getMetadata(model).getColumnMetadataByProperty(ConfigBase.TYPE_COLUMN);
    return typeColumn.options.default as string;
  }


  private createSystemConfigFromConfig(config: ConfigBase): ISystemConfig {
    const systemConfig: ISystemConfig = {
      id: ConfigBase.createId(config.type, config.id),
      __client: config.__client,
      __version: undefined,
      description: config.description,
      json: JSON.stringify(config)
    };

    return systemConfig;
  }



  private updateSystemConfigFromConfig(systemConfig: ISystemConfig, config: ConfigBase) {
    systemConfig.description = config.description;
    systemConfig.json = JSON.stringify(config);
  }
}