import { Injectable, Optional } from '@angular/core';
import { Http, RequestOptionsArgs, Response, URLSearchParams } from '@angular/http';

import 'rxjs/add/observable/throw';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/do';
import 'rxjs/add/operator/map';
import { Observable } from 'rxjs/Observable';
import { Subscriber } from 'rxjs/Subscriber';


// -------------------------------------- logging --------------------------------------------
// tslint:disable-next-line:no-unused-variable
import { getLogger, ILogger, levels, using, XLog } from '@fluxgate/platform';
// -------------------------------------- logging --------------------------------------------

// Fluxgate
import { AppConfigService, CoreService, MetadataService, Service } from '@fluxgate/client';
import {
  ConfigBase, CreateResult, DeleteResult, FindByIdResult, FindResult, ServiceConstants, StatusFilter,
  StatusQuery, TableService, UpdateResult
} from '@fluxgate/common';
import { Assert, Funktion, IToString, NotSupportedException, SelectorTerm } from '@fluxgate/core';


/**
 * Service für REST-Api für Entities mit der Basisklasse @see{ConfigBase}.
 *
 * @export
 * @class ConfigService
 * @extends {Service<ConfigBase, string>}
 */
@Injectable()
@TableService(ConfigBase)
export class ConfigService<T extends ConfigBase> extends Service<T, string> {

  public constructor(metadataService: MetadataService, http: Http, configService: AppConfigService,
    @Optional() model: Funktion) {
    // Hinweis: hier muss ein fixes Topic unabhängig von der Modelklasse gesetzt werden,
    // da der entsprechende Server-Controller auf diesem Endpoint horcht!
    super(model ? model : ConfigBase, metadataService, http, configService, 'config');
  }


  public find(filter?: StatusFilter): Observable<FindResult<T>> {
    return using(new XLog(ConfigService.logger, levels.INFO, 'find',
      `[${this.getModelClassName()}]: filter = ${JSON.stringify(filter)}`), (log) => {

        const serializedFilter = this.serialize(filter);

        return this.http.post(`${this.getUrl()}/${ServiceConstants.FIND}`, serializedFilter, {
          ...CoreService.OPTIONS,
          params: this.createParams()
        })
          .map((response: Response) => this.deserialize(response.json()))
          .do((result: FindResult<T>) => {
            if (log.isInfoEnabled()) {
              log.log(`found [${this.getModelClassName()}]: -> ${result.items.length} item(s)`);
            }
          })
          .catch(this.handleError);
      });
  }


  public findById(id: string): Observable<FindByIdResult<T, string>> {
    Assert.notNull(id, 'id');
    return using(new XLog(ConfigService.logger, levels.INFO, 'findById',
      `[${this.getModelClassName()}]; id = ${id}`), (log) => {

        return this.http.get(`${this.getUrl()}/${id}`, {
          params: this.createParams()
        })
          .map((response: Response) => this.deserialize(response.json()))
          .do((result: FindByIdResult<T, string>) => {
            if (log.isInfoEnabled()) {
              log.log(`found [${this.getModelClassName()}]: id = ${id} -> ${JSON.stringify(result)}`);
            }
          })
          .catch(this.handleError);
      });
  }


  public create(item: T): Observable<CreateResult<T, string>> {
    Assert.notNull(item, 'item');
    return using(new XLog(ConfigService.logger, levels.INFO, 'create', `[${this.getModelClassName()}]`), (log) => {

      if (log.isDebugEnabled()) {
        log.debug(`item = ${JSON.stringify(item)}`);
      }

      return this.http.post(`${this.getUrl()}/${ServiceConstants.CREATE}`, this.serialize(item), {
        params: this.createParams()
      })
        .map((response: Response) => this.deserialize(response.json()))
        .do((result: CreateResult<T, string>) => {
          if (log.isInfoEnabled()) {
            log.log(`created ${JSON.stringify(result)}`);
          }
        })
        .catch(this.handleError);
    });
  }


  public update(item: T): Observable<UpdateResult<T, string>> {
    Assert.notNull(item, 'item');
    return using(new XLog(Service.logger, levels.INFO, 'update',
      `[${this.getModelClassName()}]: id ${item.id}`), (log) => {

        if (log.isDebugEnabled()) {
          log.debug(`item = ${JSON.stringify(item)}`);
        }

        return this.http.put(`${this.getUrl()}/${ServiceConstants.UPDATE}`, this.serialize(item), {
          params: this.createParams()
        })
          .map((response: Response) => this.deserialize(response.json()))
          .do((result: UpdateResult<T, string>) => {
            if (log.isInfoEnabled()) {
              log.log(`updated [${this.getModelClassName()}]: ${JSON.stringify(result)}`);
            }
          })
          .catch(this.handleError);
      });
  }

  public delete(id: string): Observable<DeleteResult<string>> {
    Assert.notNull(id, 'id');
    return using(new XLog(Service.logger, levels.INFO, 'delete', `[${this.getModelClassName()}]: id = ${id}`),
      (log) => {

        return this.http.delete(`${this.getUrl()}/${id}`, {
          params: this.createParams()
        })
          .map((response: Response) => this.deserialize(response.json()))
          .do((result: DeleteResult<string>) => {
            if (log.isInfoEnabled()) {
              log.log(`deleted [${this.getModelClassName()}]: ${JSON.stringify(result)}`);
            }
          })
          .catch(this.handleError);
      });
  }



  private getConfigType(): string {
    const typeColumn = this.tableMetadata.getColumnMetadataByProperty(ConfigBase.TYPE_COLUMN);
    return typeColumn.options.default as string;
  }

  private createParams(): URLSearchParams {
    const params = new URLSearchParams();
    params.set('model', this.getModelClassName());
    return params;
  }

}
