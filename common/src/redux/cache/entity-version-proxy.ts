import { Observable } from 'rxjs/Observable';
import { Subscriber } from 'rxjs/Subscriber';


// -------------------------------------- logging --------------------------------------------
// tslint:disable-next-line:no-unused-variable
import { getLogger, ILogger, levels, using, XLog } from '@fluxgate/platform';
// -------------------------------------- logging --------------------------------------------

import { IQuery, Types } from '@fluxgate/core';

import { EntityVersion } from '../../model/entityVersion';
import { ServiceProxy } from '../../model/service/service-proxy';
import { IService } from '../../model/service/service.interface';
import { ServiceResult } from '../../model/service/serviceResult';
import { EntityVersionCache, EntityVersionCacheEntry } from './entity-version-cache';

/**
 * ServiceProxy, der mit Hilfe des EntityVersionServices prüft, ob ein Servicecall
 * erforderlich ist.
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


  public create<T>(item: T): Observable<T> {
    return using(new XLog(EntityVersionProxy.logger, levels.INFO, 'create', `[${this.getTableName()}]`), (log) => {

      return Observable.create((observer: Subscriber<T>) => {
        //
        // findById immer durchführen, aber danach items und entityVersion aktualisieren
        //
        super.create(item).subscribe((it) => {
          this.entityVersionService.findById(this.getTableName()).subscribe((entityVersion) => {
            const cacheEntry = EntityVersionCache.instance.get<T>(this.getTableName());

            if (log.isDebugEnabled()) {
              log.debug(`entityVersion = ${entityVersion.__version}`);
            }

            if (cacheEntry) {
              if (log.isDebugEnabled()) {
                log.debug(`cached entityVersion = ${cacheEntry.version}, items = ${cacheEntry.items.length}`);
              }

              let items = [...cacheEntry.items, it];
              EntityVersionCache.instance.set(this.getTableName(),
                new EntityVersionCacheEntry<T>(entityVersion, items));
            }

            observer.next(it);
          });
        });
      });
    });
  }


  public query<T>(query: IQuery): Observable<T[]> {
    return using(new XLog(EntityVersionProxy.logger, levels.INFO, 'query', `[${this.getTableName()}]`), (log) => {
      return super.query(query);
    });
  }

  public find<T>(): Observable<T[]> {
    return using(new XLog(EntityVersionProxy.logger, levels.INFO, 'find', `[${this.getTableName()}]`), (log) => {

      return Observable.create((observer: Subscriber<T[]>) => {
        //
        // aktuelle entityVersion ermitteln
        //
        this.entityVersionService.findById(this.getTableName()).subscribe((entityVersion) => {
          const cacheEntry = EntityVersionCache.instance.get(this.getTableName());

          if (log.isDebugEnabled()) {
            log.debug(`entityVersion = ${entityVersion.__version}`);
          }

          const updater = (lg, ev, items, message) => {
            if (lg.isDebugEnabled()) {
              lg.debug(message);
            }

            const updatedCacheEnty = new EntityVersionCacheEntry<T>(ev, items);
            EntityVersionCache.instance.set(this.getTableName(), updatedCacheEnty);
            observer.next(items);
          };

          //
          // noch nichts im Cache? -> immer service call
          //
          if (!cacheEntry) {
            super.find().subscribe((items) => {
              updater(log, entityVersion, items, 'items not cached');
            });

          } else {

            //
            // Version veraltet? -> service call
            //
            if (cacheEntry.version < entityVersion.__version) {
              super.find().subscribe((items) => {
                updater(log, entityVersion, items, `updating cached items [` +
                  `cached entityVersion = ${cacheEntry.version}, items = ${cacheEntry.items.length}]`);
              });
            } else {
              // ... sonst Items aus cache
              updater(log, entityVersion, cacheEntry.items, `items already cached [` +
                `cached entityVersion = ${cacheEntry.version}, items = ${cacheEntry.items.length}]`);
            }
          }

        });
      });
    });
  }



  public findById<T, TId>(id: TId): Observable<T> {
    return using(new XLog(EntityVersionProxy.logger, levels.INFO, 'findById', `[${this.getTableName()}]`), (log) => {

      return Observable.create((observer: Subscriber<T>) => {
        //
        // findById immer durchführen, aber danach items und entityVersion aktualisieren
        //
        super.findById(id).subscribe((it) => {
          this.entityVersionService.findById(this.getTableName()).subscribe((entityVersion) => {
            const cacheEntry = EntityVersionCache.instance.get<T>(this.getTableName());

            if (log.isDebugEnabled()) {
              log.debug(`entityVersion = ${entityVersion.__version}`);
            }

            if (cacheEntry) {
              if (log.isDebugEnabled()) {
                log.debug(`cached entityVersion = ${cacheEntry.version}, items = ${cacheEntry.items.length}`);
              }

              let items;
              if (Types.hasProperty(it, 'id')) {
                items = cacheEntry.items.map((e) => (e as any).id === it.id ? it : e);
              } else {
                items = [...cacheEntry.items];
              }
              EntityVersionCache.instance.set(this.getTableName(),
                new EntityVersionCacheEntry<T>(entityVersion, items));
            }

            observer.next(it);
          });
        });
      });
    });
  }


  public delete<T, TId>(id: TId): Observable<ServiceResult<TId>> {
    return using(new XLog(EntityVersionProxy.logger, levels.INFO, 'delete', `[${this.getTableName()}]`), (log) => {

      return Observable.create((observer: Subscriber<ServiceResult<TId>>) => {
        //
        // delete immer durchführen, aber danach items und entityVersion aktualisieren
        //
        super.delete(id).subscribe((result) => {
          this.entityVersionService.findById(this.getTableName()).subscribe((entityVersion) => {
            const cacheEntry = EntityVersionCache.instance.get<T>(this.getTableName());

            if (log.isDebugEnabled()) {
              log.debug(`entityVersion = ${entityVersion.__version}`);
            }

            if (cacheEntry) {
              if (log.isDebugEnabled()) {
                log.debug(`cached entityVersion = ${cacheEntry.version}, items = ${cacheEntry.items.length}`);
              }

              // entity muss id Property haben
              const items = cacheEntry.items.filter((e) => (e as any).id === result.id);
              EntityVersionCache.instance.set(this.getTableName(),
                new EntityVersionCacheEntry<T>(entityVersion, items));
            }

            observer.next(result);
          });
        });
      });
    });
  }


  public update<T>(item: T): Observable<T> {
    return using(new XLog(EntityVersionProxy.logger, levels.INFO, 'update', `[${this.getTableName()}]`), (log) => {

      return Observable.create((observer: Subscriber<T>) => {
        //
        // update immer durchführen, aber danach items und entityVersion aktualisieren
        //
        super.update(item).subscribe((it) => {
          this.entityVersionService.findById(this.getTableName()).subscribe((entityVersion) => {
            const cacheEntry = EntityVersionCache.instance.get<T>(this.getTableName());

            if (log.isDebugEnabled()) {
              log.debug(`entityVersion = ${entityVersion.__version}`);
            }

            if (cacheEntry) {
              if (log.isDebugEnabled()) {
                log.debug(`cached entityVersion = ${cacheEntry.version}, items = ${cacheEntry.items.length}`);
              }

              let items;
              if (Types.hasProperty(it, 'id')) {
                items = cacheEntry.items.map((e) => (e as any).id === it.id ? it : e);
              } else {
                items = [...cacheEntry.items];
              }
              EntityVersionCache.instance.set(this.getTableName(),
                new EntityVersionCacheEntry<T>(entityVersion, items));
            }

            observer.next(it);
          });
        });
      });
    });
  }
}