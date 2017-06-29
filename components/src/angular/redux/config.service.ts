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
import { AppConfigService, CoreService, MetadataService, ServiceCore } from '@fluxgate/client';
import {
  ConfigBase, CreateResult, DeleteResult, FindByIdResult, FindResult, ServiceConstants, StatusFilter,
  StatusQuery, TableService, UpdateResult
} from '@fluxgate/common';
import { Assert, Funktion, IToString, NotSupportedException, SelectorTerm, Types } from '@fluxgate/core';


/**
 * Service für REST-Api für Entities mit der Basisklasse @see{ConfigBase}.
 *
 * @export
 * @class ConfigService
 * @extends {Service<ConfigBase, string>}
 */
@Injectable()
@TableService(ConfigBase)
export class ConfigService<T extends ConfigBase> extends ServiceCore {
  protected static readonly logger = getLogger(ConfigService);

  public constructor(metadataService: MetadataService, http: Http, private configService: AppConfigService,
    @Optional() private model: Funktion) {
    // Hinweis: hier muss ein fixes Topic unabhängig von der Modelklasse gesetzt werden,
    // da der entsprechende Server-Controller auf diesem Endpoint horcht!
    super(http, configService.config.url, 'config');
  }


  public find(model: string | Funktion, filter?: StatusFilter): Observable<FindResult<T>> {
    return using(new XLog(ConfigService.logger, levels.INFO, 'find',
      `[${model}]: filter = ${JSON.stringify(filter)}`), (log) => {

        model = this.getModelString(log, model);

        const serializedFilter = this.serialize(filter);

        return this.http.post(`${this.getUrl()}/${ServiceConstants.FIND}`, serializedFilter, {
          ...CoreService.OPTIONS,
          params: this.createParams(model)
        })
          .map((response: Response) => this.deserialize(response.json()))
          .do((result: FindResult<T>) => {
            if (log.isInfoEnabled()) {
              log.log(`found [${model}]: -> ${result.items.length} item(s)`);
            }
          })
          .catch(this.handleError);
      });
  }


  public findById(model: string | Funktion, id: string): Observable<FindByIdResult<T, string>> {
    Assert.notNull(id, 'id');
    return using(new XLog(ConfigService.logger, levels.INFO, 'findById',
      `[${model}]; id = ${id}`), (log) => {

        model = this.getModelString(log, model);

        return this.http.get(`${this.getUrl()}/${id}`, {
          params: this.createParams(model)
        })
          .map((response: Response) => this.deserialize(response.json()))
          .do((result: FindByIdResult<T, string>) => {
            if (log.isInfoEnabled()) {
              log.log(`found [${model}]: id = ${id} -> ${JSON.stringify(result)}`);
            }
          })
          .catch(this.handleError);
      });
  }


  public create(model: string | Funktion, item: T): Observable<CreateResult<T, string>> {
    Assert.notNull(item, 'item');
    return using(new XLog(ConfigService.logger, levels.INFO, 'create', `[${model}]`), (log) => {

      model = this.getModelString(log, model);

      if (log.isDebugEnabled()) {
        log.debug(`item = ${JSON.stringify(item)}`);
      }

      return this.http.post(`${this.getUrl()}/${ServiceConstants.CREATE}`, this.serialize(item), {
        params: this.createParams(model)
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


  public update(model: string | Funktion, item: T): Observable<UpdateResult<T, string>> {
    Assert.notNull(item, 'item');
    return using(new XLog(ConfigService.logger, levels.INFO, 'update',
      `[${model}]: id ${item.id}`), (log) => {

        model = this.getModelString(log, model);

        if (log.isDebugEnabled()) {
          log.debug(`item = ${JSON.stringify(item)}`);
        }

        return this.http.put(`${this.getUrl()}/${ServiceConstants.UPDATE}`, this.serialize(item), {
          params: this.createParams(model)
        })
          .map((response: Response) => this.deserialize(response.json()))
          .do((result: UpdateResult<T, string>) => {
            if (log.isInfoEnabled()) {
              log.log(`updated [${model}]: ${JSON.stringify(result)}`);
            }
          })
          .catch(this.handleError);
      });
  }

  public delete(model: string | Funktion, id: string): Observable<DeleteResult<string>> {
    Assert.notNull(id, 'id');
    return using(new XLog(ConfigService.logger, levels.INFO, 'delete', `[${model}]: id = ${id}`),
      (log) => {

        model = this.getModelString(log, model);

        return this.http.delete(`${this.getUrl()}/${id}`, {
          params: this.createParams(model)
        })
          .map((response: Response) => this.deserialize(response.json()))
          .do((result: DeleteResult<string>) => {
            if (log.isInfoEnabled()) {
              log.log(`deleted [${model}]: ${JSON.stringify(result)}`);
            }
          })
          .catch(this.handleError);
      });
  }


  private createParams(model: string): URLSearchParams {
    const params = new URLSearchParams();
    params.set('model', model);
    return params;
  }


  /**
   * Liefert für das angebene @param{model} das Model als String bzw. falls ein Model über den Konstruktor
   * übergeben wurde dessen Name.
   *
   * @param log
   * @param model
   */
  private getModelString(log: XLog, model: string | Funktion): string {
    let modelString = typeof model === 'string' ? model : model.name;

    if (this.model) {
      if (!Types.isPresent(model)) {
        modelString = this.model.name;

        if (log.isDebugEnabled()) {
          log.debug(`set model to: ${modelString}`);
        }
      } else {
        Assert.that(this.model.name === modelString);
      }
    }

    return modelString;
  }

}
