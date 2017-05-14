import { Observable } from 'rxjs/Observable';
import { Subscriber } from 'rxjs/Subscriber';


// -------------------------------------- logging --------------------------------------------
// tslint:disable-next-line:no-unused-variable
import { getLogger, ILogger, levels, using, XLog } from '@fluxgate/platform';
// -------------------------------------- logging --------------------------------------------

import { IQuery, IToString } from '@fluxgate/core';

import { IEntity } from '../../model/entity.interface';
import { EntityVersion } from '../../model/entityVersion';
import { ServiceProxy } from '../../model/service/service-proxy';
import { IService } from '../../model/service/service.interface';
import { ServiceResult } from '../../model/service/serviceResult';
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
   * @returns {Observable<T>}
   *
   * @memberof EntityVersionProxy
   */
  public create<T extends IEntity<TId>, TId extends IToString>(item: T): Observable<T> {
    return using(new XLog(EntityVersionProxy.logger, levels.INFO, 'create', `[${this.getTableName()}]`), (log) => {

      return Observable.create((observer: Subscriber<T>) => {
        //
        // findById immer durchführen, aber danach items und entityVersion aktualisieren
        //
        super.create(item).subscribe((itemCreated) => {
          this.entityVersionService.findById(this.getTableName()).subscribe((entityVersion) => {
            const cacheEntry = EntityVersionCache.instance.get<T>(this.getTableName());

            if (log.isDebugEnabled()) {
              log.debug(`entityVersion = ${entityVersion.__version}`);
            }

            if (cacheEntry) {
              if (log.isDebugEnabled()) {
                log.debug(`cached entityVersion = ${cacheEntry.version}, items = ${cacheEntry.items.length}`);
              }

              this.updateCache(log, entityVersion, [...cacheEntry.items, itemCreated], 'add item to cache');

            } else {
              this.updateCache(log, entityVersion, [itemCreated], 'no cache yet');
            }

            observer.next(itemCreated);
          });
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
   * @returns {Observable<T[]>}
   *
   * @memberof EntityVersionProxy
   */
  public query<T>(query: IQuery): Observable<T[]> {
    return using(new XLog(EntityVersionProxy.logger, levels.INFO, 'query', `[${this.getTableName()}]`), (log) => {
      return super.query(query);
    });
  }


  /**
   * Liefert alle Entities, ggf. aus dem Cache und aktualisiert den Cache
   *
   * @template T
   * @returns {Observable<T[]>}
   *
   * @memberof EntityVersionProxy
   */
  public find<T>(): Observable<T[]> {
    return using(new XLog(EntityVersionProxy.logger, levels.INFO, 'find', `[${this.getTableName()}]`), (log) => {

      return Observable.create((observer: Subscriber<T[]>) => {

        const finder = (lg: XLog, ev: EntityVersion, message: string) => {
          super.find().subscribe((itemsFound) => {
            this.updateCache(lg, ev, itemsFound, message);
            observer.next(itemsFound);
          });
        };


        //
        // aktuelle entityVersion ermitteln
        //
        this.entityVersionService.findById(this.getTableName()).subscribe((entityVersion) => {
          const cacheEntry = EntityVersionCache.instance.get<T>(this.getTableName());

          if (log.isDebugEnabled()) {
            log.debug(`entityVersion = ${entityVersion.__version}`);
          }


          //
          // noch nichts im Cache? -> immer service call
          //
          if (cacheEntry) {

            //
            // Version veraltet? -> service call
            //
            if (this.isNewer(entityVersion, cacheEntry)) {
              finder(log, entityVersion, `updating cached items [` +
                `cached entityVersion = ${cacheEntry.version}, items = ${cacheEntry.items.length}]`);

            } else {

              // ... sonst Items aus cache
              if (log.isDebugEnabled()) {
                log.debug(`items already cached [` +
                  `cached entityVersion = ${cacheEntry.version}, items = ${cacheEntry.items.length}]`);
              }

              observer.next(cacheEntry.items);
            }
          } else {
            finder(log, entityVersion, 'no cache yet');
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
   * @returns {Observable<T>}
   *
   * @memberof EntityVersionProxy
   */
  public findById<T extends IEntity<TId>, TId extends IToString>(id: TId): Observable<T> {
    return using(new XLog(EntityVersionProxy.logger, levels.INFO, 'findById', `[${this.getTableName()}]: id = ${id}`),
      (log) => {

        return Observable.create((observer: Subscriber<T>) => {

          const finder = (lg: XLog, ev: EntityVersion, findId: TId, items: T[], message: string) => {
            super.findById(findId).subscribe((itemFound: T) => {
              const itemsFiltered = items.map((e) => e.id === itemFound.id ? itemFound : e);
              this.updateCache(lg, ev, itemsFiltered, message);
              observer.next(itemFound);
            });
          };

          //
          // findById nur durchführen, falls die entityVersion neuer ist -> sonst Entity aus Cache-Items
          //
          this.entityVersionService.findById(this.getTableName()).subscribe((entityVersion) => {
            const cacheEntry = EntityVersionCache.instance.get<T>(this.getTableName());

            if (log.isDebugEnabled()) {
              log.debug(`entityVersion = ${entityVersion.__version}`);
            }

            if (cacheEntry) {
              if (log.isDebugEnabled()) {
                log.debug(`cached entityVersion = ${cacheEntry.version}, items = ${cacheEntry.items.length}`);
              }

              //
              // falls EntityVersion neuer -> findById + update cache
              //
              if (this.isNewer(entityVersion, cacheEntry)) {
                finder(log, entityVersion, id, cacheEntry.items, 'findById + update cache');

              } else {
                // Item aus Cache
                const item = cacheEntry.items.find((e) => e.id === id);

                if (log.isDebugEnabled()) {
                  log.debug(`item already cached`);
                }
                observer.next(item);
              }
            } else {
              // noch nie gecached -> findById + update cache
              finder(log, entityVersion, id, [], 'no cache yet');
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
   * @returns {Observable<ServiceResult<TId>>}
   *
   * @memberof EntityVersionProxy
   */
  public delete<T extends IEntity<TId>, TId extends IToString>(id: TId): Observable<ServiceResult<TId>> {
    return using(new XLog(EntityVersionProxy.logger, levels.INFO, 'delete', `[${this.getTableName()}]: id = ${id}`),
      (log) => {

        return Observable.create((observer: Subscriber<ServiceResult<TId>>) => {

          //
          // delete immer durchführen, aber danach items und entityVersion aktualisieren
          //
          super.delete(id).subscribe((resultDeleted) => {
            this.entityVersionService.findById(this.getTableName()).subscribe((entityVersion) => {
              const cacheEntry = EntityVersionCache.instance.get<T>(this.getTableName());

              if (log.isDebugEnabled()) {
                log.debug(`entityVersion = ${entityVersion.__version}`);
              }

              if (cacheEntry) {
                if (log.isDebugEnabled()) {
                  log.debug(`cached entityVersion = ${cacheEntry.version}, items = ${cacheEntry.items.length}`);
                }

                // Item entfernen
                const itemsFiltered = cacheEntry.items.filter((e) => e.id !== resultDeleted.id);
                this.updateCache(log, entityVersion, itemsFiltered, 'delete item from cache');
                observer.next(resultDeleted);
              } else {
                this.updateCache(log, entityVersion, [], 'no cache yet');
                observer.next(resultDeleted);
              }
            });
          });

        });
      });
  }


  /**
   * Aktualisiert die Entity item und aktualisiert den Cache.
   *
   * @template T
   * @param {T} item
   * @returns {Observable<T>}
   *
   * @memberof EntityVersionProxy
   */
  public update<T extends IEntity<TId>, TId extends IToString>(item: T): Observable<T> {
    return using(new XLog(EntityVersionProxy.logger, levels.INFO,
      'update', `[${this.getTableName()}]: id = ${item.id}`), (log) => {

        return Observable.create((observer: Subscriber<T>) => {

          //
          // update immer durchführen, aber danach items und entityVersion aktualisieren
          //
          super.update(item).subscribe((itemUpdated: T) => {
            this.entityVersionService.findById(this.getTableName()).subscribe((entityVersion) => {
              const cacheEntry = EntityVersionCache.instance.get<T>(this.getTableName());

              if (log.isDebugEnabled()) {
                log.debug(`entityVersion = ${entityVersion.__version}`);
              }

              if (cacheEntry) {
                if (log.isDebugEnabled()) {
                  log.debug(`cached entityVersion = ${cacheEntry.version}, items = ${cacheEntry.items.length}`);
                }

                // Item ersetzen
                const itemsFiltered = cacheEntry.items.map((e) => e.id === itemUpdated.id ? itemUpdated : e);
                this.updateCache(log, entityVersion, itemsFiltered, 'update item in cache');
                observer.next(itemUpdated);

              } else {
                this.updateCache(log, entityVersion, [], 'no cache yet');
                observer.next(itemUpdated);
              }
            });
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
  private updateCache<T>(log: XLog, entityVersion: EntityVersion, items: T[], message: string) {
    if (log.isDebugEnabled()) {
      log.debug(message);
    }

    const updatedCacheEnty = new EntityVersionCacheEntry<T>(entityVersion, items);
    EntityVersionCache.instance.set(this.getTableName(), updatedCacheEnty);
  };

}