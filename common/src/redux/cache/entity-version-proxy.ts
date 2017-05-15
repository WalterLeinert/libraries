import { Observable } from 'rxjs/Observable';
import { Subscriber } from 'rxjs/Subscriber';


// -------------------------------------- logging --------------------------------------------
// tslint:disable-next-line:no-unused-variable
import { getLogger, ILogger, levels, using, XLog } from '@fluxgate/platform';
// -------------------------------------- logging --------------------------------------------

import { IQuery, IToString } from '@fluxgate/core';

import { IEntity } from '../../model/entity.interface';
import { EntityVersion } from '../../model/entityVersion';
import { CreateServiceResult } from '../../model/service/create-service-result';
import { DeleteServiceResult } from '../../model/service/delete-service-result';
import { FindByIdServiceResult } from '../../model/service/find-by-id-service-result';
import { FindServiceResult } from '../../model/service/find-service-result';
import { QueryServiceResult } from '../../model/service/query-service-result';
import { ServiceProxy } from '../../model/service/service-proxy';
import { IService } from '../../model/service/service.interface';
import { UpdateServiceResult } from '../../model/service/update-service-result';
import { EntityVersionCache, EntityVersionCacheEntry } from './entity-version-cache';

/**
 * ServiceProxy, der mit Hilfe des EntityVersionServices prüft, ob ein Servicecall
 * erforderlich ist. Es wird ein Cache gepflegt, die letzte EntityVersion und die Item-Liste vom letzten find() enthält.
 * Die Servicecalls aktualisieren den Cache und pflegen die Item-Liste im Cache.
 *
 * @export
 * @class EntityVersionProxy
 * @extends {ServiceProxy<any, any>}
 */
export class EntityVersionProxy extends ServiceProxy<any, any> {
  protected static readonly logger = getLogger(EntityVersionProxy);

  constructor(service: IService<any, any>,
    private entityVersionService: IService<EntityVersion, string>) {
    super(service);
  }


  /**
   * Erzeugt eine neue Entity und aktualisiert den Cache
   *
   * @template T
   * @param {T} item
   * @returns {Observable<CreateServiceResult<T>>}
   *
   * @memberof EntityVersionProxy
   */
  public create<T extends IEntity<TId>, TId extends IToString>(item: T): Observable<CreateServiceResult<T>> {
    return using(new XLog(EntityVersionProxy.logger, levels.INFO, 'create', `[${this.getTableName()}]`), (log) => {

      return Observable.create((observer: Subscriber<CreateServiceResult<T>>) => {

        super.create(item).subscribe((createResult: CreateServiceResult<T>) => {
          const cacheEntry = EntityVersionCache.instance.get<T>(this.getTableName());

          if (log.isDebugEnabled()) {
            log.debug(`entityVersion = ${createResult.entityVersion}`);
          }

          if (cacheEntry) {
            if (log.isDebugEnabled()) {
              log.debug(`cached entityVersion = ${cacheEntry.version}, items = ${cacheEntry.items.length}`);
            }

            this.updateCache(log, createResult.entityVersion, [...cacheEntry.items, createResult.item],
              'add item to cache');

          } else {
            this.updateCache(log, createResult.entityVersion, [createResult.item], 'no cache yet');
          }

          observer.next(createResult);
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
   * @returns {Observable<QueryServiceResult<T>>}
   *
   * @memberof EntityVersionProxy
   */
  public query<T>(query: IQuery): Observable<QueryServiceResult<T>> {
    return using(new XLog(EntityVersionProxy.logger, levels.INFO, 'query', `[${this.getTableName()}]`), (log) => {
      return super.query(query);
    });
  }


  /**
   * Liefert alle Entities, ggf. aus dem Cache und aktualisiert den Cache
   *
   * @template T
   * @returns {Observable<FindServiceResult<T>>}
   *
   * @memberof EntityVersionProxy
   */
  public find<T>(): Observable<FindServiceResult<T>> {
    return using(new XLog(EntityVersionProxy.logger, levels.INFO, 'find', `[${this.getTableName()}]`), (log) => {

      return Observable.create((observer: Subscriber<FindServiceResult<T>>) => {

        const finder = (lg: XLog, ev: EntityVersion, message: string) => {
          super.find().subscribe((findResult) => {
            this.updateCache(lg, findResult.entityVersion, findResult.items, message);
            observer.next(findResult);
          });
        };


        //
        // aktuelle entityVersion ermitteln
        //
        this.entityVersionService.findById(this.getTableName()).subscribe((entityVersionResult) => {
          const cacheEntry = EntityVersionCache.instance.get<T>(this.getTableName());

          if (log.isDebugEnabled()) {
            log.debug(`entityVersion = ${entityVersionResult.item.__version}`);
          }


          //
          // noch nichts im Cache? -> immer service call
          //
          if (cacheEntry) {

            //
            // Version veraltet? -> service call
            //
            if (this.isNewer(entityVersionResult.item, cacheEntry)) {
              finder(log, entityVersionResult.item, `updating cached items [` +
                `cached entityVersion = ${cacheEntry.version}, items = ${cacheEntry.items.length}]`);

            } else {

              // ... sonst Items aus cache
              if (log.isDebugEnabled()) {
                log.debug(`items already cached [` +
                  `cached entityVersion = ${cacheEntry.version}, items = ${cacheEntry.items.length}]`);
              }

              observer.next(new FindServiceResult<T>(cacheEntry.items, cacheEntry.version));
            }
          } else {
            finder(log, entityVersionResult.item, 'no cache yet');
          }

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
   * @returns {Observable<FindByIdServiceResult>}
   *
   * @memberof EntityVersionProxy
   */
  public findById<T extends IEntity<TId>, TId extends IToString>(id: TId): Observable<FindByIdServiceResult<T, TId>> {
    return using(new XLog(EntityVersionProxy.logger, levels.INFO, 'findById', `[${this.getTableName()}]: id = ${id}`),
      (log) => {

        return Observable.create((observer: Subscriber<FindByIdServiceResult<T, TId>>) => {

          const finder = (lg: XLog, ev: EntityVersion, findId: TId, items: T[], message: string) => {
            super.findById(findId).subscribe((findByIdResult: FindByIdServiceResult<T, TId>) => {
              const itemsFiltered = items.map((e) => e.id === findByIdResult.item.id ? findByIdResult : e);
              this.updateCache(lg, findByIdResult.entityVersion, itemsFiltered, message);
              observer.next(findByIdResult);
            });
          };

          //
          // findById nur durchführen, falls die entityVersion neuer ist -> sonst Entity aus Cache-Items
          //
          this.entityVersionService.findById(this.getTableName()).subscribe((entityVersionResult) => {
            const cacheEntry = EntityVersionCache.instance.get<T>(this.getTableName());

            if (log.isDebugEnabled()) {
              log.debug(`entityVersion = ${entityVersionResult.item.__version}`);
            }

            if (cacheEntry) {
              if (log.isDebugEnabled()) {
                log.debug(`cached entityVersion = ${cacheEntry.version}, items = ${cacheEntry.items.length}`);
              }

              //
              // falls EntityVersion neuer -> findById + update cache
              //
              if (this.isNewer(entityVersionResult.item, cacheEntry)) {
                finder(log, entityVersionResult.item, id, cacheEntry.items, 'findById + update cache');

              } else {
                // Item aus Cache
                const item = cacheEntry.items.find((e) => e.id === id);

                if (log.isDebugEnabled()) {
                  log.debug(`item already cached`);
                }
                observer.next(new FindByIdServiceResult<T, TId>(item, cacheEntry.version));
              }
            } else {
              // noch nie gecached -> findById + update cache
              finder(log, entityVersionResult.item, id, [], 'no cache yet');
            }
          });
        });
      });
  }


  /**
   * Löscht die Entity mit Id @param{id} und aktualisiert den Cache
   *
   * @template T
   * @template TId
   * @param {TId} id
   * @returns {Observable<DeleteServiceResult<TId>>}
   *
   * @memberof EntityVersionProxy
   */
  public delete<T extends IEntity<TId>, TId extends IToString>(id: TId): Observable<DeleteServiceResult<TId>> {
    return using(new XLog(EntityVersionProxy.logger, levels.INFO, 'delete', `[${this.getTableName()}]: id = ${id}`),
      (log) => {

        return Observable.create((observer: Subscriber<DeleteServiceResult<TId>>) => {

          super.delete(id).subscribe((deleteResult) => {
            const cacheEntry = EntityVersionCache.instance.get<T>(this.getTableName());

            if (log.isDebugEnabled()) {
              log.debug(`entityVersion = ${deleteResult.entityVersion}`);
            }

            if (cacheEntry) {
              if (log.isDebugEnabled()) {
                log.debug(`cached entityVersion = ${cacheEntry.version}, items = ${cacheEntry.items.length}`);
              }

              // Item entfernen
              const itemsFiltered = cacheEntry.items.filter((e) => e.id !== deleteResult.id);
              this.updateCache(log, deleteResult.entityVersion, itemsFiltered, 'delete item from cache');
              observer.next(deleteResult);
            } else {
              this.updateCache(log, deleteResult.entityVersion, [], 'no cache yet');
              observer.next(deleteResult);
            }
          });
        });
      });
  }


  /**
   * Aktualisiert die Entity item und aktualisiert den Cache.
   *
   * @template T
   * @param {T} item
   * @returns {Observable<UpdateServiceResult<T>>}
   *
   * @memberof EntityVersionProxy
   */
  public update<T extends IEntity<TId>, TId extends IToString>(item: T): Observable<UpdateServiceResult<T>> {
    return using(new XLog(EntityVersionProxy.logger, levels.INFO,
      'update', `[${this.getTableName()}]: id = ${item.id}`), (log) => {

        return Observable.create((observer: Subscriber<UpdateServiceResult<T>>) => {

          //
          // update immer durchführen, aber danach items und entityVersion aktualisieren
          //
          super.update(item).subscribe((updateResult: UpdateServiceResult<T>) => {
            const cacheEntry = EntityVersionCache.instance.get<T>(this.getTableName());

            if (log.isDebugEnabled()) {
              log.debug(`entityVersion = ${updateResult.entityVersion}`);
            }

            if (cacheEntry) {
              if (log.isDebugEnabled()) {
                log.debug(`cached entityVersion = ${cacheEntry.version}, items = ${cacheEntry.items.length}`);
              }

              // Item ersetzen
              const itemsFiltered = cacheEntry.items.map((e) => e.id === updateResult.item.id ? updateResult : e);
              this.updateCache(log, updateResult.entityVersion, itemsFiltered, 'update item in cache');
              observer.next(updateResult);

            } else {
              this.updateCache(log, updateResult.entityVersion, [], 'no cache yet');
              observer.next(updateResult);
            }
          });
        });
      });
  }


  /**
   * Liefert true, falls die aktuelle EntityVersion neuer als die im Cache ist -> update des Caches.
   */
  private isNewer<T>(version: EntityVersion, chachedVersion: EntityVersionCacheEntry<T>): boolean {
    return version.__version > chachedVersion.version;
  }


  /**
   * aktualisiert den Cache und gibt eine Logmeldung aus.
   */
  private updateCache<T>(log: XLog, entityVersion: number, items: T[], message: string) {
    if (log.isDebugEnabled()) {
      log.debug(message);
    }

    const updatedCacheEnty = new EntityVersionCacheEntry<T>(entityVersion, items);
    EntityVersionCache.instance.set(this.getTableName(), updatedCacheEnty);
  };

}