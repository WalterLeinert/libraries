import * as Knex from 'knex';
import { Service } from 'ts-express-decorators';

// -------------------------------------- logging --------------------------------------------
// tslint:disable-next-line:no-unused-variable
import { getLogger, ILogger, levels, using, XLog } from '@fluxgate/platform';
// -------------------------------------- logging --------------------------------------------

import {
  ConfigBase, CreateResult, DeleteResult, EntityStatus, FilterBehaviour, FindByIdResult,
  FindResult, IStatusQuery, ISystemConfig, QueryResult,
  StatusFilter, StatusQuery, TableMetadata, UpdateResult
} from '@fluxgate/common';
import {
  Assert, Funktion, JsonSerializer, NotImplementedException, NotSupportedException,
  Query, SelectorTerm
} from '@fluxgate/core';

import { ISessionRequest } from '../session/session-request.interface';
import { IBaseService } from './baseService.interface';
import { MetadataService } from './metadata.service';
import { ServiceCore } from './service-core';
import { ServiceProxy } from './service-proxy';
import { SystemConfigService } from './system-config.service';

/**
 * Klasse zum Ermitteln einer Systemkonfiguration für einen gegebenenn Key und eine Id
 * Die Konfiguration liegt in der Entity SystemConfig als JSON-String eines
 * serialisierten Objekts vor.
 *
 * @export
 * @class ConfigService
 */
@Service()
export class ConfigService extends ServiceCore {
  protected static readonly logger = getLogger(ConfigService);

  private serializer: JsonSerializer = new JsonSerializer();


  public constructor(private systemConfigService: SystemConfigService, private metadataService: MetadataService) {
    super();
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

        this.systemConfigService.findById<ISystemConfig>(request, id)
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
          operator: '=',
          value: `${ConfigBase.createId(type, '')}%`
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
    return using(new XLog(ConfigService.logger, levels.INFO, 'query', `[${model}]`), (log) => {
      if (log.isDebugEnabled()) {
        log.debug(`query = ${JSON.stringify(query)}`);
      }

      return new Promise<QueryResult<T>>((resolve, reject) => {
        this.systemConfigService.query(request, query)
          .then((queryResult) => {
            const result = queryResult.items.map((item) => {
              return this.deserialize<T>(JSON.parse(item.json));
            });
            resolve(new QueryResult(result, -1));
          });
      });
    });
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
        const systemConfig: ISystemConfig = {
          id: ConfigBase.createId(subject.type, subject.id),
          __client: undefined,    // set by systemConfigService
          __version: 0,
          description: subject.description,
          json: JSON.stringify(subject)
        };

        this.systemConfigService.create(request, systemConfig)
          .then((result) => {
            resolve(new CreateResult(subject, -1));
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
        const systemConfig: ISystemConfig = {
          id: ConfigBase.createId(subject.type, subject.id),
          __client: subject.__client,     // set by systemConfigService
          __version: undefined,           // TODO
          description: subject.description,
          json: JSON.stringify(subject)
        };

        this.systemConfigService.update(request, systemConfig)
          .then((result) => {
            resolve(new UpdateResult(subject, -1));
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
      return this.systemConfigService.delete(null, id);
    });
  }



  protected deserialize<T>(json: any): T {
    Assert.notNull(json);
    return this.serializer.deserialize<T>(json);
  }

  private getConfigType(model: string): string {
    const metadata = this.metadataService.findTableMetadata(model);
    const typeColumn = metadata.getColumnMetadataByProperty(ConfigBase.TYPE_COLUMN);
    return typeColumn.options.default as string;
  }
}