import { Observable ,  Subscriber } from 'rxjs';


// -------------------------------------- logging --------------------------------------------
// tslint:disable-next-line:no-unused-variable
import { getLogger, ILogger, levels, using, XLog } from '@fluxgate/platform';
// -------------------------------------- logging --------------------------------------------

import { Clone, IToString, StringBuilder, Types } from '@fluxgate/core';

import { EntityStatusHelper } from '../../model/entity-status';
import { IEntity } from '../../model/entity.interface';
import { EntityVersion } from '../../model/entityVersion';
import { IFlxEntity } from '../../model/flx-entity.interface';
import { CreateResult } from '../../model/service/create-result';
import { DeleteResult } from '../../model/service/delete-result';
import { FindByIdResult } from '../../model/service/find-by-id-result';
import { FindResult } from '../../model/service/find-result';
import { QueryResult } from '../../model/service/query-result';
import { ServiceProxy } from '../../model/service/service-proxy';
import { ServiceResult } from '../../model/service/service-result';
import { IService } from '../../model/service/service.interface';
import { StatusFilter } from '../../model/service/status-filter';
import { IStatusQuery } from '../../model/service/status-query';
import { UpdateResult } from '../../model/service/update-result';
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
export class EntityVersionProxy<T extends IEntity<TId>, TId extends IToString> extends ServiceProxy<T, TId> {
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
   * @returns {Observable<CreateResult<T>>}
   *
   * @memberof EntityVersionProxy
   */
  public create(item: T): Observable<CreateResult<T, TId>> {
    return using(new XLog(EntityVersionProxy.logger, levels.INFO, 'create', `[${this.getTableName()}]`), (log) => {

      return Observable.create((observer: Subscriber<CreateResult<T, TId>>) => {

        super.create(item).subscribe((createResult: CreateResult<T, TId>) => {
          const cacheKey = this.createCacheEntryKey(this.getTableName());
          const cacheEntry = EntityVersionCache.instance.get<T>(cacheKey);

          if (log.isDebugEnabled()) {
            this.logEntityVersion(log, item.id, createResult, cacheEntry);
          }

          if (cacheEntry) {
            const updater = (ce: EntityVersionCacheEntry<T>) => [...ce.items, createResult.item];

            this.updateCache(log, createResult.entityVersion, cacheEntry, updater,
              `add item[${this.getObjId(createResult.item)}] to cache`, false);

            //
            // items aus dem Cache immer Klonen, damit es sich ähnlich wie bei echten Serverrequests verhält
            //
            createResult = new CreateResult(Clone.clone(createResult.item), createResult.entityVersion);
            createResult.__setFromCache();
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
   * @memberof EntityVersionProxy
   */
  public query(query: IStatusQuery): Observable<QueryResult<T>> {
    return using(new XLog(EntityVersionProxy.logger, levels.INFO, 'query', `[${this.getTableName()}]`), (log) => {
      return Observable.create((observer: Subscriber<QueryResult<T>>) => {
        super.query(query).subscribe((result) => {
          observer.next(result);
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
   * @memberof EntityVersionProxy
   */
  public find(filter?: StatusFilter): Observable<FindResult<T>> {
    return using(new XLog(EntityVersionProxy.logger, levels.INFO, 'find', `[${this.getTableName()}]`), (log) => {

      return Observable.create((observer: Subscriber<FindResult<T>>) => {

        const finder = (lg: XLog, ev: EntityVersion, cacheEntry: EntityVersionCacheEntry<T>, message: string) => {
          super.find(filter).subscribe((findResult) => {
            this.updateCache(lg, findResult.entityVersion, cacheEntry, () => findResult.items, message, true, filter);
            observer.next(findResult);
          }, (err) => {
            observer.error(err);
          });
        };


        //
        // aktuelle entityVersion ermitteln
        //
        this.entityVersionService.findById(this.getTableName()).subscribe((entityVersionResult) => {
          const cacheKey = this.createCacheEntryKey(this.getTableName(), filter);
          const cacheEntry = EntityVersionCache.instance.get<T>(cacheKey);

          if (log.isDebugEnabled()) {
            log.debug(`entityVersion[${this.getTableName()}] = ${entityVersionResult.item.__version}`);
          }


          //
          // bereits im cache?
          //
          if (cacheEntry) {

            //
            // Version veraltet? -> service call
            //
            if (this.isNewer(entityVersionResult.item, cacheEntry)) {
              finder(log, entityVersionResult.item, cacheEntry, `updating cached items [` +
                `cached entityVersion[${cacheKey}] = ${cacheEntry.version}, ` +
                `items = ${cacheEntry.items.length}]`);

            } else {

              // ... sonst Items aus cache
              if (log.isDebugEnabled()) {
                log.debug(`items already cached [` +
                  `cached entityVersion[${cacheKey}] = ${cacheEntry.version}, ` +
                  `items = ${cacheEntry.items.length}]`);
              }

              let items = cacheEntry.items;

              //
              // items aus dem Cache immer Klonen, damit es sich ähnlich wie bei echten Serverrequests verhält
              //
              items = Clone.clone(items);

              const findResult = new FindResult<T>(items, cacheEntry.version);
              findResult.__setFromCache();
              observer.next(findResult);
            }
          } else {
            // noch nichts im Cache? -> immer service call
            finder(log, entityVersionResult.item, undefined, 'no cache yet');
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
   * @returns {Observable<FindByIdResult>}
   *
   * @memberof EntityVersionProxy
   */
  public findById(id: TId): Observable<FindByIdResult<T, TId>> {
    return using(new XLog(EntityVersionProxy.logger, levels.INFO, 'findById', `[${this.getTableName()}]: id = ${id}`),
      (log) => {

        return Observable.create((observer: Subscriber<FindByIdResult<T, TId>>) => {

          const finder = (lg: XLog, ev: EntityVersion, findId: TId, cacheEntry: EntityVersionCacheEntry<T>,
            message: string) => {

            super.findById(findId).subscribe((findByIdResult: FindByIdResult<T, TId>) => {

              //
              // nur, falls bereits einmal find() durchgeführt wurde existieren Items im Cache;
              // sonst wird der Cache nicht gepflegt, bis das erste find() gelaufen ist
              //
              if (cacheEntry) {
                const updater = (ce: EntityVersionCacheEntry<T>) =>
                  ce.items.map((e) => e.id === findByIdResult.item.id ? findByIdResult.item : e);

                this.updateCache(lg, findByIdResult.entityVersion, cacheEntry, updater, message, false);

                //
                // item aus dem Cache immer Klonen, damit es sich ähnlich wie bei echten Serverrequests verhält
                //
                findByIdResult = new FindByIdResult(Clone.clone(findByIdResult.item), findByIdResult.entityVersion);
                findByIdResult.__setFromCache();
              }

              observer.next(findByIdResult);
            }, (err) => {
              observer.error(err);
            });
          };

          //
          // findById nur durchführen, falls die entityVersion neuer ist -> sonst Entity aus Cache-Items
          //
          this.entityVersionService.findById(this.getTableName())
            .subscribe((entityVersionResult) => {
              const cacheKey = this.createCacheEntryKey(this.getTableName());
              const cacheEntry = EntityVersionCache.instance.get<T>(cacheKey);

              if (log.isDebugEnabled()) {
                log.debug(`entityVersion[${this.getObjId(id)}] = ${entityVersionResult.item.__version}`);
              }

              if (cacheEntry) {
                if (log.isDebugEnabled()) {
                  log.debug(`cached entityVersion[${cacheKey}] = ${cacheEntry.version}, ` +
                    `items = ${cacheEntry.items.length}`);
                }

                //
                // falls EntityVersion neuer -> findById + update cache
                //
                if (this.isNewer(entityVersionResult.item, cacheEntry)) {
                  finder(log, entityVersionResult.item, id, cacheEntry, 'findById + update cache');

                } else {
                  // Item aus Cache
                  let item = cacheEntry.items.find((e) => e.id === id);

                  if (log.isDebugEnabled()) {
                    log.debug(`entityVersion[${cacheKey}] already cached`);
                  }


                  //
                  // item aus dem Cache immer Klonen, damit es sich ähnlich wie bei echten Serverrequests verhält
                  //
                  item = Clone.clone(item);

                  const result = new FindByIdResult<T, TId>(item, cacheEntry.version);
                  result.__setFromCache();

                  observer.next(result);
                }
              } else {
                // noch nie gecached -> kein cache update
                finder(log, entityVersionResult.item, id, null, 'no cache yet');
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
   * @returns {Observable<DeleteResult<TId>>}
   *
   * @memberof EntityVersionProxy
   */
  public delete(id: TId): Observable<DeleteResult<TId>> {
    return using(new XLog(EntityVersionProxy.logger, levels.INFO, 'delete', `[${this.getTableName()}]: id = ${id}`),
      (log) => {

        return Observable.create((observer: Subscriber<DeleteResult<TId>>) => {

          super.delete(id).subscribe((deleteResult) => {
            const cacheKey = this.createCacheEntryKey(this.getTableName());
            const cacheEntry = EntityVersionCache.instance.get<T>(cacheKey);

            if (log.isDebugEnabled()) {
              this.logEntityVersion(log, id, deleteResult, cacheEntry);
            }

            if (cacheEntry) {

              // Item entfernen
              const updater = (ce: EntityVersionCacheEntry<T>) => ce.items.filter((e) => e.id !== deleteResult.id);

              this.updateCache(log, deleteResult.entityVersion, cacheEntry, updater,
                `delete item[${this.getTableName()}] from cache`, false);

              deleteResult.__setFromCache();

              observer.next(deleteResult);
            } else {
              // noch nie gecached -> kein cache update
              observer.next(deleteResult);
            }
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
   * @memberof EntityVersionProxy
   */
  public update(item: T): Observable<UpdateResult<T, TId>> {
    return using(new XLog(EntityVersionProxy.logger, levels.INFO,
      'update', `[${this.getTableName()}]: id = ${item.id}`), (log) => {

        return Observable.create((observer: Subscriber<UpdateResult<T, TId>>) => {

          //
          // update immer durchführen, aber danach items und entityVersion aktualisieren
          //
          super.update(item).subscribe((updateResult: UpdateResult<T, TId>) => {
            const cacheKey = this.createCacheEntryKey(this.getTableName());
            const cacheEntry = EntityVersionCache.instance.get<T>(cacheKey);

            if (log.isDebugEnabled()) {
              this.logEntityVersion(log, item.id, updateResult, cacheEntry);
            }

            if (cacheEntry) {
              let updater = (ce: EntityVersionCacheEntry<T>) => [];

              // TODO: eigentlich Test über "instanceof FlxStatusEntity" -> geht aber so nicht wegen
              // zyklischer Abhängigkeiten!
              if (Types.hasProperty(updateResult.item, EntityStatusHelper.PROPERTY_NAME_DELETED)
                && updateResult.item[EntityStatusHelper.PROPERTY_NAME_DELETED] === true) {
                // Item entfernen
                updater = (ce: EntityVersionCacheEntry<T>) => ce.items.filter((e) => e.id !== updateResult.item.id);
              } else {
                // Item ersetzen
                updater = (ce: EntityVersionCacheEntry<T>) =>
                  ce.items.map((e) => e.id === updateResult.item.id ? updateResult.item : e);
              }

              this.updateCache(log, updateResult.entityVersion, cacheEntry, updater,
                `update item[${this.getTableName()}] in cache`, false);


              //
              // item aus dem Cache immer Klonen, damit es sich ähnlich wie bei echten Serverrequests verhält
              //
              updateResult = new UpdateResult<T, TId>(Clone.clone(updateResult.item), updateResult.entityVersion);
              updateResult.__setFromCache();

              observer.next(updateResult);

            } else {
              // noch nie gecached -> kein cache update
              observer.next(updateResult);
            }
          }, (err) => {
            observer.error(err);
          });
        });
      });
  }


  /**
   * Liefert true, falls die aktuelle EntityVersion neuer als die im Cache ist -> update des Caches.
   */
  private isNewer<TTest>(version: EntityVersion, chachedVersion: EntityVersionCacheEntry<TTest>): boolean {
    return version.__version > chachedVersion.version;
  }


  /**
   * aktualisiert den Cache und gibt eine Logmeldung aus.
   */
  private updateCache(log: XLog, entityVersion: number, cacheEntry: EntityVersionCacheEntry<T>,
    updater: (ce: EntityVersionCacheEntry<T>) => T[], message: string, setCache: boolean, filter?: StatusFilter) {

    if (log.isDebugEnabled()) {
      log.debug(message);
    }

    const cacheKey = this.createCacheEntryKey(this.getTableName(), filter);

    if (setCache) {
      const updatedCacheEnty = new EntityVersionCacheEntry<T>(entityVersion, updater(cacheEntry));
      EntityVersionCache.instance.set(cacheKey, updatedCacheEnty);
    } else {
      EntityVersionCache.instance.getKeysStartingWith(cacheKey).forEach((key) => {
        const ce = EntityVersionCache.instance.get<T>(key);

        const updatedCacheEnty = new EntityVersionCacheEntry<T>(entityVersion, updater(ce));
        EntityVersionCache.instance.set(key, updatedCacheEnty);
      });
    }
  }



  private logEntityVersion(log: XLog, id: TId, result: ServiceResult,
    cacheEntry: EntityVersionCacheEntry<T>) {

    if (log.isDebugEnabled()) {
      const sb = new StringBuilder(`entityVersion[${this.getObjId(id)}`);
      sb.append(']');

      if (Types.isPresent(result)) {
        sb.append(`: result = ${result.toString()}`);
      }
      // log.debug(`entityVersion[${this.getTableName()}, id: ${id}] = ${result.entityVersion}`);

      log.debug(sb.toString());

      if (cacheEntry) {
        log.debug(`cached entityVersion[${this.getObjId(id)}]: cacheEntry = ${cacheEntry.toString()}`);
      }
    }
  }


  private createCacheEntryKey(entity: string, statusFilter?: StatusFilter) {
    return `${entity}+${statusFilter ? statusFilter.toString() : ''}`;
  }

}