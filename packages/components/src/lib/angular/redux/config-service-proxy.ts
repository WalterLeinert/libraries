import { Injectable } from '@angular/core';

import { Observable ,  Subscriber } from 'rxjs';

// -------------------------------------- logging --------------------------------------------
// tslint:disable-next-line:no-unused-variable
import { getLogger, ILogger, levels, using, XLog } from '@fluxgate/platform';
// -------------------------------------- logging --------------------------------------------

import {
  ConfigBase, CreateResult, DeleteResult, FindByIdResult, FindResult, IService,
  IStatusQuery, QueryResult, StatusFilter, TableMetadata, TableService, UpdateResult
} from '@fluxgate/common';
import { Assert, NotSupportedException } from '@fluxgate/core';


import { ConfigService } from './config.service';


/**
 * Proxy für REST-Api Services.
 * Delegiert service calls an den eigentlichen Service.
 */

@Injectable()
@TableService(ConfigBase)
export class ConfigServiceProxy implements IService<ConfigBase, string> {
  protected static readonly logger = getLogger(ConfigServiceProxy);

  private _model: string;


  /**
   * Setzt den eigentlichen Service
   */
  public constructor(private _service: ConfigService<ConfigBase>) {
    Assert.notNull(_service);
  }


  public create(item: ConfigBase): Observable<CreateResult<ConfigBase, string>> {
    return using(new XLog(ConfigServiceProxy.logger, levels.INFO, 'create'), (log) => {
      return Observable.create((observer: Subscriber<CreateResult<ConfigBase, string>>) => {
        this.service.create(this.model, item).subscribe((result) => {
          observer.next(result);
        }, (err) => {
          observer.error(err);
        });
      });
    });
  }


  public query(query: IStatusQuery): Observable<QueryResult<ConfigBase>> {
    throw new NotSupportedException();
  }


  public find(filter?: StatusFilter): Observable<FindResult<ConfigBase>> {
    return using(new XLog(ConfigServiceProxy.logger, levels.INFO, 'find'), (log) => {
      return Observable.create((observer: Subscriber<FindResult<ConfigBase>>) => {
        this.service.find(this.model, filter).subscribe((result) => {
          observer.next(result);
        }, (err) => {
          observer.error(err);
        });
      });
    });
  }


  public findById(id: string): Observable<FindByIdResult<ConfigBase, string>> {
    return using(new XLog(ConfigServiceProxy.logger, levels.INFO, 'findById'), (log) => {
      return Observable.create((observer: Subscriber<FindByIdResult<ConfigBase, string>>) => {
        this.service.findById(this.model, id).subscribe((result: FindByIdResult<ConfigBase, string>) => {
          observer.next(result);
        }, (err) => {
          observer.error(err);
        });
      });
    });
  }


  public delete(id: string): Observable<DeleteResult<string>> {
    return using(new XLog(ConfigServiceProxy.logger, levels.INFO, 'delete'), (log) => {
      return Observable.create((observer: Subscriber<DeleteResult<string>>) => {
        return this.service.delete(this.model, id).subscribe((result) => {
          observer.next(result);
        }, (err) => {
          observer.error(err);
        });
      });
    });
  }


  public update(item: ConfigBase): Observable<UpdateResult<ConfigBase, string>> {
    return using(new XLog(ConfigServiceProxy.logger, levels.INFO, 'update'), (log) => {
      return Observable.create((observer: Subscriber<UpdateResult<ConfigBase, string>>) => {
        this.service.update(this.model, item).subscribe((updateResult: UpdateResult<ConfigBase, string>) => {
          observer.next(updateResult);
        }, (err) => {
          observer.error(err);
        });
      });
    });
  }

  public getUrl(): string {
    return this.service.getUrl();
  }

  public getTopic(): string {
    return this.service.getTopic();
  }

  public getTopicPath(): string {
    return this.service.getTopicPath();
  }

  public getEntityId(item: any): any {
    return this.service.getEntityId(item);
  }

  public setEntityId(item: any, id: any) {
    return this.service.setEntityId(item, id);
  }

  public getModelClassName(): string {
    return this.service.getModelClassName();
  }

  public getTableName(): string {
    return this.service.getTableName();
  }

  public get tableMetadata(): TableMetadata {
    return this._service.tableMetadata;
  }

  public get model(): string {
    return this._model;
  }

  public setModel(model: string) {
    this._model = model;
  }


  /**
   * der eigentliche Service
   */
  protected get service(): ConfigService<ConfigBase> {
    return this._service;
  }
}