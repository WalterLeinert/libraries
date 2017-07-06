import { Observable } from 'rxjs/Observable';
import { Subscriber } from 'rxjs/Subscriber';


// -------------------------------------- logging --------------------------------------------
// tslint:disable-next-line:no-unused-variable
import { getLogger, ILogger, levels, using, XLog } from '@fluxgate/platform';
// -------------------------------------- logging --------------------------------------------


import { Assert, CacheManager, IToString, Types } from '@fluxgate/core';

import { AppConfig, IAppConfig } from '../../base/appConfig';
import { AppRegistry } from '../../base/appRegistry';
import { IEntity } from '../../model/entity.interface';
import { CreateResult } from '../../model/service/create-result';
import { DeleteResult } from '../../model/service/delete-result';
import { FindByIdResult } from '../../model/service/find-by-id-result';
import { FindResult } from '../../model/service/find-result';
import { QueryResult } from '../../model/service/query-result';
import { ServiceProxy } from '../../model/service/service-proxy';
import { IService } from '../../model/service/service.interface';
import { StatusFilter } from '../../model/service/status-filter';
import { IStatusQuery } from '../../model/service/status-query';
import { UpdateResult } from '../../model/service/update-result';


/**
 * ServiceProxy, der einen Entity-Cache implementiert.
 *
 * @export
 * @class CacheProxy
 */
export class CacheProxy<T extends IEntity<TId>, TId extends IToString> extends ServiceProxy<T, TId> {
  private static _cacheManager: CacheManager;

  constructor(service: IService<any, any>) {
    super(service);

    if (!CacheProxy._cacheManager) {
      const config = AppRegistry.instance.get<IAppConfig>(AppConfig.APP_CONFIG_KEY);

      Assert.notNull(config,
        `application configuration not available"`);

      Assert.notNull(config.cacheManagerConfiguration,
        `application configuration contains no section "cacheManagerConfiguration"`);

      CacheProxy._cacheManager = new CacheManager(config.cacheManagerConfiguration);
    }
  }


  /**
   * Erzeugt eine neue Entity und aktualisiert den Cache
   *
   * @template T
   * @param {T} item
   * @returns {Observable<CreateResult<T>>}
   *
   * @memberof CacheProxy
   */
  public create(item: T): Observable<CreateResult<T, TId>> {
    return using(new XLog(CacheProxy.logger, levels.INFO, 'create', `[${this.getTableName()}]`), (log) => {

      return Observable.create((observer: Subscriber<CreateResult<T, TId>>) => {
        super.create(item).subscribe((createResult: CreateResult<T, TId>) => {

          if (CacheProxy._cacheManager.containsCache(this.tableMetadata.className)) {
            CacheProxy._cacheManager.setItem(this.tableMetadata.className, item.id, item);
          }

          observer.next(createResult);
        }, (err) => {
          observer.error(err);
        });

      });
    });
  }


  /**
   * Sucht nach Entities
   *
   * TODO: ggf. query cache pflegen und query result aus Cache liefert, falls EntityVersionen gleich
   *
   * @template T
   * @param {IQuery} query
   * @returns {Observable<QueryResult<T>>}
   *
   * @memberof CacheProxy
   */
  public query(query: IStatusQuery): Observable<QueryResult<T>> {
    return using(new XLog(CacheProxy.logger, levels.INFO, 'query', `[${this.getTableName()}]`), (log) => {
      return Observable.create((observer: Subscriber<QueryResult<T>>) => {
        super.query(query).subscribe((queryResult) => {

          if (CacheProxy._cacheManager.containsCache(this.tableMetadata.className)) {
            queryResult.items.forEach((item) => {
              CacheProxy._cacheManager.setItem(this.tableMetadata.className, item.id, item);
            });
          }

          observer.next(queryResult);
        }, (err) => {
          observer.error(err);
        });
      });
    });
  }


  /**
   * Liefert alle Entities, ggf. aus dem Cache und aktualisiert den Cache
   *
   * @template T
   * @returns {Observable<FindResult<T>>}
   *
   * @memberof CacheProxy
   */
  public find(filter?: StatusFilter): Observable<FindResult<T>> {
    return using(new XLog(CacheProxy.logger, levels.INFO, 'find', `[${this.getTableName()}]`), (log) => {

      return Observable.create((observer: Subscriber<FindResult<T>>) => {
        super.find(filter).subscribe((findResult) => {

          if (CacheProxy._cacheManager.containsCache(this.tableMetadata.className)) {
            findResult.items.forEach((item) => {
              CacheProxy._cacheManager.setItem(this.tableMetadata.className, item.id, item);
            });
          }

          observer.next(findResult);
        }, (err) => {
          observer.error(err);
        });
      });
    });
  }


  /**
   * Liefert die Entity für die Id @param{id} und aktualisiert den Cache.
   *
   * @template T
   * @template TId
   * @param {TId} id
   * @returns {Observable<FindByIdResult>}
   *
   * @memberof CacheProxy
   */
  public findById(id: TId): Observable<FindByIdResult<T, TId>> {
    return using(new XLog(CacheProxy.logger, levels.INFO, 'findById', `[${this.getTableName()}]: id = ${id}`),
      (log) => {

        return Observable.create((observer: Subscriber<FindByIdResult<T, TId>>) => {
          const item = CacheProxy._cacheManager.getItem<T, TId>(this.tableMetadata.className, id);

          if (!Types.isPresent(item)) {
            super.findById(id).subscribe((findByIdResult: FindByIdResult<T, TId>) => {

              if (CacheProxy._cacheManager.containsCache(this.tableMetadata.className)) {
                CacheProxy._cacheManager.setItem(this.tableMetadata.className, findByIdResult.item.id,
                  findByIdResult.item);
              }

              observer.next(findByIdResult);
            }, (err) => {
              observer.error(err);
            });
          } else {
            observer.next(new FindByIdResult(item, -1));
          }
        });
      });
  }


  /**
   * Löscht die Entity mit Id @param{id} und aktualisiert den Cache
   *
   * @template T
   * @template TId
   * @param {TId} id
   * @returns {Observable<DeleteResult<TId>>}
   *
   * @memberof CacheProxy
   */
  public delete(id: TId): Observable<DeleteResult<TId>> {
    return using(new XLog(CacheProxy.logger, levels.INFO, 'delete', `[${this.getTableName()}]: id = ${id}`),
      (log) => {

        return Observable.create((observer: Subscriber<DeleteResult<TId>>) => {
          super.delete(id).subscribe((deleteResult) => {

            if (CacheProxy._cacheManager.containsCache(this.tableMetadata.className)) {
              CacheProxy._cacheManager.removeItem<TId>(this.tableMetadata.className, id);
            }

            observer.next(deleteResult);
          }, (err) => {
            observer.error(err);
          });
        });
      });
  }


  /**
   * Aktualisiert die Entity item und aktualisiert den Cache.
   *
   * @template T
   * @param {T} item
   * @returns {Observable<UpdateResult<T>>}
   *
   * @memberof CacheProxy
   */
  public update(item: T): Observable<UpdateResult<T, TId>> {
    return using(new XLog(CacheProxy.logger, levels.INFO,
      'update', `[${this.getTableName()}]: id = ${item.id}`), (log) => {

        return Observable.create((observer: Subscriber<UpdateResult<T, TId>>) => {
          super.update(item).subscribe((updateResult: UpdateResult<T, TId>) => {

            if (CacheProxy._cacheManager.containsCache(this.tableMetadata.className)) {
              CacheProxy._cacheManager.setItem(this.tableMetadata.className, updateResult.item.id, updateResult.item);
            }

            observer.next(updateResult);

          }, (err) => {
            observer.error(err);
          });
        });
      });
  }
}