import * as Knex from 'knex';
import { Service } from 'ts-express-decorators';

// -------------------------------------- logging --------------------------------------------
// tslint:disable-next-line:no-unused-variable
import { getLogger, ILogger, levels, using, XLog } from '@fluxgate/platform';
// -------------------------------------- logging --------------------------------------------

import {
  ConfigBase, CreateResult, DeleteResult, FindByIdResult, FindResult, IStatusQuery, ISystemConfig, QueryResult,
  StatusFilter, TableMetadata, UpdateResult
} from '@fluxgate/common';
import {
  Assert, Funktion, JsonSerializer, NotImplementedException, NotSupportedException,
  Query, SelectorTerm
} from '@fluxgate/core';

import { ISessionRequest } from '../session/session-request.interface';
import { IBaseService } from './baseService.interface';
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
export class ConfigService extends ServiceCore implements IBaseService<ConfigBase, string> {
  protected static readonly logger = getLogger(ConfigService);

  private serializer: JsonSerializer = new JsonSerializer();


  protected constructor(private systemConfigService: SystemConfigService) {
    super();
  }


  /**
   * Liefert für den Typ @param{type} und die Id @param{id} die zugehörige Systemconfiguration
   * mit Hilfe des Services @see{SystemConfigService}.
   *
   * @template T - Konfigurationstyp
   * @param {string} type - Typ der Konfiguration (z.B. 'smtp')
   * @param {string} id - Id der Konfiguration ('z.B. 'default')
   * @returns {Promise<T>} - Promise vom Typ @see{T}
   * @memberof ConfigService
   */
  public findById<T extends ConfigBase>(request: ISessionRequest, id: string):
    Promise<FindByIdResult<T, string>> {
    return using(new XLog(ConfigService.logger, levels.INFO, 'findById', `[${this.tableName}] id = ${id}`), (log) => {
      return new Promise<FindByIdResult<T, string>>((resolve, reject) => {

        this.systemConfigService.findById<ISystemConfig>(null, id)
          .then((result) => {
            resolve(new FindByIdResult(this.deserialize<T>(JSON.parse(result.item.json)), -1));
          });
      });
    });
  }


  /**
   * find() nicht möglich, da die Typ-Information für die Suche fehlt -> daher wird
   * find() im Client auf query abgebildet.
   *
   * @returns {Promise<T[]>}
   */
  public find<T extends ConfigBase>(request: ISessionRequest, filter?: StatusFilter):
    Promise<FindResult<T>> {
    throw new NotSupportedException();
  }


  public queryKnex(
    request: ISessionRequest,
    query: Knex.QueryBuilder,
    filter?: StatusFilter
  ): Promise<QueryResult<ConfigBase>> {
    throw new NotSupportedException();
  }


  public query<T extends ConfigBase>(
    request: ISessionRequest,
    query: IStatusQuery
  ): Promise<QueryResult<ConfigBase>> {
    return using(new XLog(ConfigService.logger, levels.INFO, 'query', `[${this.tableName}]`), (log) => {
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
    subject: ConfigBase
  ): Promise<CreateResult<T, string>> {
    return using(new XLog(ConfigService.logger, levels.INFO, 'create', `[${this.tableName}]`), (log) => {
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
    subject: ConfigBase
  ): Promise<UpdateResult<T, string>> {
    return using(new XLog(ConfigService.logger, levels.INFO, 'update', `[${this.tableName}]`), (log) => {
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
    id: string
  ): Promise<DeleteResult<string>> {
    return using(new XLog(ConfigService.logger, levels.INFO, 'delete', `[${this.tableName}] id = ${id}`), (log) => {
      return this.systemConfigService.delete(null, id);
    });
  }


  public fromTable(table?: string | Funktion): Knex.QueryBuilder {
    throw new NotSupportedException();
  }

  public get tableName(): string {
    return this.systemConfigService.tableName;
  }

  public get metadata(): TableMetadata {
    throw new NotSupportedException();
  }


  public get idColumnName(): string {
    throw new NotSupportedException();
  }

  public set idColumnName(name: string) {
    throw new NotSupportedException();
  }


  protected deserialize<T>(json: any): T {
    Assert.notNull(json);
    return this.serializer.deserialize<T>(json);
  }
}