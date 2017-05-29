import { Observable } from 'rxjs/Observable';
import { Subscriber } from 'rxjs/Subscriber';


// -------------------------------------- logging --------------------------------------------
// tslint:disable-next-line:no-unused-variable
import { getLogger, ILogger, levels, using, XLog } from '@fluxgate/platform';
// -------------------------------------- logging --------------------------------------------

import { Clone, IQuery, IToString, StringBuilder, Types } from '@fluxgate/core';

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
          const cacheEntry = EntityVersionCache.instance.get<T>(this.getTableName());

          if (log.isDebugEnabled()) {
            this.logEntityVersion(log, item.id, createResult, cacheEntry);
          }

          if (cacheEntry) {
            this.updateCache(log, createResult.entityVersion, [...cacheEntry.items, createResult.item],
              `add item[${this.getObjId(createResult.item)}] to cache`);


            //
            // items aus dem Cache immer Klonen, damit es sich ähnlich wie bei echten Serverrequests verhält
            //
            createResult = new CreateResult(Clone.clone(createResult.item), createResult.entityVersion);
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
   * @returns {Observable<QueryResult<T>>}
   *
   * @memberof EntityVersionProxy
   */
  public query(query: IQuery): Observable<QueryResult<T>> {
    return using(new XLog(EntityVersionProxy.logger, levels.INFO, 'query', `[${this.getTableName()}]`), (log) => {
      return super.query(query);
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
  public find(): Observable<FindResult<T>> {
    return using(new XLog(EntityVersionProxy.logger, levels.INFO, 'find', `[${this.getTableName()}]`), (log) => {

      return Observable.create((observer: Subscriber<FindResult<T>>) => {

        const finder = (lg: XLog, ev: EntityVersion, message: string) => {
          super.find().subscribe((findResult) => {
            this.updateCache(lg, findResult.entityVersion, findResult.items, message);
            observer.next(findResult);
          });
        };


        //
        // aktuelle entityVersion ermitteln
        //
        this.entityVersionService.findById<IFlxEntity<string>>(this.getTableName()).subscribe((entityVersionResult) => {
          const cacheEntry = EntityVersionCache.instance.get<T>(this.getTableName());

          if (log.isDebugEnabled()) {
            log.debug(`entityVersion[${this.getTableName()}] = ${entityVersionResult.item.__version}`);
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
                `cached entityVersion[${this.getTableName()}] = ${cacheEntry.version}, ` +
                `items = ${cacheEntry.items.length}]`);

            } else {

              // ... sonst Items aus cache
              if (log.isDebugEnabled()) {
                log.debug(`items already cached [` +
                  `cached entityVersion[${this.getTableName()}] = ${cacheEntry.version}, ` +
                  `items = ${cacheEntry.items.length}]`);
              }

              let items = cacheEntry.items;

              //
              // items aus dem Cache immer Klonen, damit es sich ähnlich wie bei echten Serverrequests verhält
              //
              items = Clone.clone(items);

              observer.next(new FindResult<T>(items, cacheEntry.version));
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
   * @returns {Observable<FindByIdResult>}
   *
   * @memberof EntityVersionProxy
   */
  public findById(id: TId): Observable<FindByIdResult<T, TId>> {
    return using(new XLog(EntityVersionProxy.logger, levels.INFO, 'findById', `[${this.getTableName()}]: id = ${id}`),
      (log) => {

        return Observable.create((observer: Subscriber<FindByIdResult<T, TId>>) => {

          const finder = (lg: XLog, ev: EntityVersion, findId: TId, items: T[], message: string) => {
            super.findById(findId).subscribe((findByIdResult: FindByIdResult<T, TId>) => {
              //
              // nur, falls bereits einmal find() durchgeführt wurde existieren Items im Cache;
              // sonst wird der Cache nicht gepflegt, bis das erste find() gelaufen ist
              //
              if (!Types.isNullOrEmpty(items)) {
                const itemsFiltered = items.map((e) => e.id === findByIdResult.item.id ? findByIdResult.item : e);
                this.updateCache(lg, findByIdResult.entityVersion, itemsFiltered, message);

                //
                // item aus dem Cache immer Klonen, damit es sich ähnlich wie bei echten Serverrequests verhält
                //
                findByIdResult = new FindByIdResult(Clone.clone(findByIdResult.item), findByIdResult.entityVersion);
              }

              observer.next(findByIdResult);
            });
          };

          //
          // findById nur durchführen, falls die entityVersion neuer ist -> sonst Entity aus Cache-Items
          //
          this.entityVersionService.findById<IFlxEntity<string>>(this.getTableName())
            .subscribe((entityVersionResult) => {
              const cacheEntry = EntityVersionCache.instance.get<T>(this.getTableName());

              if (log.isDebugEnabled()) {
                log.debug(`entityVersion[${this.getObjId(id)}] = ${entityVersionResult.item.__version}`);
              }

              if (cacheEntry) {
                if (log.isDebugEnabled()) {
                  log.debug(`cached entityVersion[${this.getTableName()}] = ${cacheEntry.version}, ` +
                    `items = ${cacheEntry.items.length}`);
                }

                //
                // falls EntityVersion neuer -> findById + update cache
                //
                if (this.isNewer(entityVersionResult.item, cacheEntry)) {
                  finder(log, entityVersionResult.item, id, cacheEntry.items, 'findById + update cache');

                } else {
                  // Item aus Cache
                  let item = cacheEntry.items.find((e) => e.id === id);

                  if (log.isDebugEnabled()) {
                    log.debug(`entityVersion[${this.getTableName()}] already cached`);
                  }


                  //
                  // item aus dem Cache immer Klonen, damit es sich ähnlich wie bei echten Serverrequests verhält
                  //
                  item = Clone.clone(item);

                  observer.next(new FindByIdResult<T, TId>(item, cacheEntry.version));
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
            const cacheEntry = EntityVersionCache.instance.get<T>(this.getTableName());

            if (log.isDebugEnabled()) {
              this.logEntityVersion(log, id, deleteResult, cacheEntry);
            }

            if (cacheEntry) {

              // Item entfernen
              const itemsFiltered = cacheEntry.items.filter((e) => e.id !== deleteResult.id);
              this.updateCache(log, deleteResult.entityVersion, itemsFiltered,
                `delete item[${this.getTableName()}] from cache`);
              observer.next(deleteResult);
            } else {
              // noch nie gecached -> kein cache update
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
            const cacheEntry = EntityVersionCache.instance.get<T>(this.getTableName());

            if (log.isDebugEnabled()) {
              this.logEntityVersion(log, item.id, updateResult, cacheEntry);
            }

            if (cacheEntry) {

              // Item ersetzen
              const itemsFiltered = cacheEntry.items.map((e) => e.id === updateResult.item.id ? updateResult.item : e);
              this.updateCache(log, updateResult.entityVersion, itemsFiltered,
                `update item[${this.getTableName()}] in cache`);


              //
              // item aus dem Cache immer Klonen, damit es sich ähnlich wie bei echten Serverrequests verhält
              //
              updateResult = new UpdateResult<T, TId>(Clone.clone(updateResult.item), updateResult.entityVersion);

              observer.next(updateResult);

            } else {
              // noch nie gecached -> kein cache update
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
  private updateCache(log: XLog, entityVersion: number, items: T[], message: string) {
    if (log.isDebugEnabled()) {
      log.debug(message);
    }

    const updatedCacheEnty = new EntityVersionCacheEntry<T>(entityVersion, items);
    EntityVersionCache.instance.set(this.getTableName(), updatedCacheEnty);
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

}