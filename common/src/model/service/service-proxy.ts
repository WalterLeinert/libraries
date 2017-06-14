import { Observable } from 'rxjs/Observable';
import { Subscriber } from 'rxjs/Subscriber';

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
      return Observable.create((observer: Subscriber<CreateResult<T, TId>>) => {
        this.service.create(item).subscribe((result) => {
          observer.next(result);
        }, (err) => {
          observer.error(err);
        });
      });
    });
  }


  public query(query: IStatusQuery): Observable<QueryResult<T>> {
    return using(new XLog(ServiceProxy.logger, levels.INFO, 'query'), (log) => {
      return Observable.create((observer: Subscriber<QueryResult<T>>) => {
        this.service.query(query).subscribe((result) => {
          observer.next(result);
        }, (err) => {
          observer.error(err);
        });
      });
    });
  }


  public find(filter?: StatusFilter): Observable<FindResult<T>> {
    return using(new XLog(ServiceProxy.logger, levels.INFO, 'find'), (log) => {
      return Observable.create((observer: Subscriber<FindResult<T>>) => {
        this.service.find(filter).subscribe((result) => {
          observer.next(result);
        }, (err) => {
          observer.error(err);
        });
      });
    });
  }


  public findById<T extends IEntity<TId>>(id: TId): Observable<FindByIdResult<T, TId>> {
    return using(new XLog(ServiceProxy.logger, levels.INFO, 'findById'), (log) => {
      return Observable.create((observer: Subscriber<FindByIdResult<T, TId>>) => {
        this.service.findById(id).subscribe((result: FindByIdResult<T, TId>) => {
          observer.next(result);
        }, (err) => {
          observer.error(err);
        });
      });
    });
  }


  public delete(id: TId): Observable<DeleteResult<TId>> {
    return using(new XLog(ServiceProxy.logger, levels.INFO, 'delete'), (log) => {
      return Observable.create((observer: Subscriber<DeleteResult<TId>>) => {
        return this.service.delete(id).subscribe((result) => {
          observer.next(result);
        }, (err) => {
          observer.error(err);
        });
      });
    });
  }


  public update(item: T): Observable<UpdateResult<T, TId>> {
    return using(new XLog(ServiceProxy.logger, levels.INFO, 'update'), (log) => {
      return Observable.create((observer: Subscriber<UpdateResult<T, TId>>) => {
        this.service.update(item).subscribe((updateResult: UpdateResult<T, TId>) => {
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