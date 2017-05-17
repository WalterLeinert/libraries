import { Observable } from 'rxjs/Observable';

// -------------------------------------- logging --------------------------------------------
// tslint:disable-next-line:no-unused-variable
import { getLogger, ILogger, levels, using, XLog } from '@fluxgate/platform';
// -------------------------------------- logging --------------------------------------------

import { Assert, IQuery, IToString } from '@fluxgate/core';

import { IEntity } from '../entity.interface';
import { CreateResult } from './create-result';
import { DeleteResult } from './delete-result';
import { FindByIdResult } from './find-by-id-result';
import { FindResult } from './find-result';
import { QueryResult } from './query-result';
import { IService } from './service.interface';
import { UpdateResult } from './update-result';

/**
 * Proxy für REST-Api Services.
 * Delegiert service calls an den eigentlichen Service.
 */
export class ServiceProxy<T extends IEntity<TId>, TId extends IToString> implements IService<T, TId> {
  protected static readonly logger = getLogger(ServiceProxy);


  /**
   * Setzt den eigentlichen Service
   */
  public constructor(private _service: IService<T, TId>) {
    Assert.notNull(_service);
  }

  public create(item: T): Observable<CreateResult<T, TId>> {
    return using(new XLog(ServiceProxy.logger, levels.INFO, 'create'), (log) => {
      return this.service.create(item);
    });
  }

  public query(query: IQuery): Observable<QueryResult<T>> {
    return using(new XLog(ServiceProxy.logger, levels.INFO, 'query'), (log) => {
      return this.service.query(query);
    });
  }

  public find(): Observable<FindResult<T>> {
    return using(new XLog(ServiceProxy.logger, levels.INFO, 'find'), (log) => {
      return this.service.find();
    });
  }

  public findById<T extends IEntity<TId>>(id: TId): Observable<FindByIdResult<T, TId>> {
    return using(new XLog(ServiceProxy.logger, levels.INFO, 'findById'), (log) => {
      return this.service.findById(id);
    });
  }

  public delete(id: TId): Observable<DeleteResult<TId>> {
    return using(new XLog(ServiceProxy.logger, levels.INFO, 'delete'), (log) => {
      return this.service.delete(id);
    });
  }

  public update(item: T): Observable<UpdateResult<T, TId>> {
    return using(new XLog(ServiceProxy.logger, levels.INFO, 'update'), (log) => {
      return this.service.update(item);
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


  /**
   * der eigentliche Service
   */
  protected get service(): IService<T, TId> {
    return this._service;
  }
}