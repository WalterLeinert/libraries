import { Observable } from 'rxjs/Observable';

// -------------------------------------- logging --------------------------------------------
// tslint:disable-next-line:no-unused-variable
import { getLogger, ILogger, levels, using, XLog } from '@fluxgate/platform';
// -------------------------------------- logging --------------------------------------------

import { Assert, IToString, StringBuilder, StringUtil, Types } from '@fluxgate/core';

import { IEntity } from '../entity.interface';
import { TableMetadata } from '../metadata/tableMetadata';
import { CreateResult } from './create-result';
import { DeleteResult } from './delete-result';
import { FindByIdResult } from './find-by-id-result';
import { FindResult } from './find-result';
import { QueryResult } from './query-result';
import { IService } from './service.interface';
import { StatusFilter } from './status-filter';
import { IStatusQuery } from './status-query';
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

  public query(query: IStatusQuery): Observable<QueryResult<T>> {
    return using(new XLog(ServiceProxy.logger, levels.INFO, 'query'), (log) => {
      return this.service.query(query);
    });
  }

  public find(filter?: StatusFilter): Observable<FindResult<T>> {
    return using(new XLog(ServiceProxy.logger, levels.INFO, 'find'), (log) => {
      return this.service.find(filter);
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

  public get tableMetadata(): TableMetadata {
    return this._service.tableMetadata;
  }

  /**
   * Liefert den Originalservice.
   *
   * @returns {IService<T, TId>}
   *
   * @memberof ProxyService
   */
  public getProxiedService(): IService<T, TId> {
    return this._service as IService<T, TId>;
  }


  /**
   * der eigentliche Service
   */
  protected get service(): IService<T, TId> {
    return this._service;
  }

  /**
   * Liefert für @param{obj} eine Objekt-Id bestehend aus Tabellennamen und einer Entity-Id.
   *
   * @protected
   * @param {(T | TId)} obj
   * @returns {string}
   *
   * @memberof ServiceProxy
   */
  protected getObjId(obj: T | TId): string {
    const sb = new StringBuilder(this.getTableName());

    if (!Types.isPrimitive(obj)) {
      const item = obj as T;
      sb.append(`, id: ${item.id}`);

      return `${StringUtil.enclose(this.getTableName(), StringUtil.format(`id: ${item.id}`))}`;
    } else {
      if (Types.isPresent(obj)) {
        sb.append(`, id: ${obj}`);
      }

      return `${StringUtil.enclose(sb.toString())}`;
    }
  }
}