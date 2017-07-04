import { Injectable, Optional } from '@angular/core';
import { Http, Response, URLSearchParams } from '@angular/http';

import 'rxjs/add/observable/throw';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/do';
import 'rxjs/add/operator/map';
import { Observable } from 'rxjs/Observable';


// -------------------------------------- logging --------------------------------------------
// tslint:disable-next-line:no-unused-variable
import { getLogger, ILogger, levels, using, XLog } from '@fluxgate/platform';
// -------------------------------------- logging --------------------------------------------

// Fluxgate
import { AppConfigService, CoreService, MetadataService, ServiceCore } from '@fluxgate/client';
import {
  ConfigBase, CreateResult, DeleteResult, FindByIdResult, FindResult, IServiceBase, ServiceConstants, StatusFilter,
  TableMetadata, TableService, UpdateResult
} from '@fluxgate/common';
import { Assert, Funktion, InvalidOperationException, Types } from '@fluxgate/core';


/**
 * Service für REST-Api für Entities mit der Basisklasse @see{ConfigBase}.
 *
 * @export
 * @class ConfigService
 * @extends {Service<ConfigBase, string>}
 */
@Injectable()
@TableService(ConfigBase)
export class ConfigService<T extends ConfigBase> extends ServiceCore implements IServiceBase<ConfigBase, string> {
  protected static readonly logger = getLogger(ConfigService);

  private _tableMetadata: TableMetadata;

  public constructor(private metadataService: MetadataService, http: Http, private configService: AppConfigService,
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


  /**
   * Liefert den Klassennamen der zugehörigen Modellklasse (Entity).
   *
   * @type {string}
   */
  public getModelClassName(): string {
    return this._tableMetadata.className;
  }

  public getTableName(): string {
    return this._tableMetadata.tableName;
  }


  /**
   * Liefert die zugehörige @see{TableMetadata}
   *
   * @readonly
   * @protected
   * @type {TableMetadata}
   * @memberOf Service
   */
  public get tableMetadata(): TableMetadata {
    return this._tableMetadata;
  }



  /**
   * Liefert die Id der Entity @param{item} über die Metainformation, falls vorhanden.
   * Sonst wird ein Error geworfen.
   *
   * @type {any}
   * @memberOf Service
   */
  public getEntityId(item: T): string {
    if (!this.tableMetadata.primaryKeyColumn) {
      throw new InvalidOperationException(`Table ${this.tableMetadata.options.name}: no primary key column`);
    }
    return item[this.tableMetadata.primaryKeyColumn.propertyName];
  }


  /**
   * Setzt die Id der Entity @param{item} über die Metainformation, falls vorhanden.
   * Sonst wird ein Error geworfen.
   *
   * @type {any}
   * @memberOf Service
   */
  public setEntityId(item: T, id: string) {
    if (!this.tableMetadata.primaryKeyColumn) {
      throw new InvalidOperationException(`Table ${this.tableMetadata.options.name}: no primary key column`);
    }
    item[this.tableMetadata.primaryKeyColumn.propertyName] = id;
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

    if (!this._tableMetadata) {
      this._tableMetadata = this.metadataService.findTableMetadata(modelString);
    } else {
      if (!Types.isNullOrEmpty(modelString)) {
        Assert.that(this._tableMetadata.className === modelString);
      } else {
        modelString = this._tableMetadata.className;
      }
    }

    return modelString;
  }

}