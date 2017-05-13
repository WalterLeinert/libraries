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
    return using(new XLog(ServiceProxy.logger, levels.INFO, 'create'), (log) => {

      return Observable.create((observer: Subscriber<T>) => {
        //
        // findById immer durchführen, aber danach items und entityVersion aktualisieren
        //
        super.create(item).subscribe((it) => {
          this.entityVersionService.findById(this.getTableName()).subscribe((entityVersion) => {
            const cacheEntry = EntityVersionCache.instance.get<T>(this.getTableName());

            if (cacheEntry) {
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
    return using(new XLog(ServiceProxy.logger, levels.INFO, 'query'), (log) => {
      return super.query(query);
    });
  }

  public find<T>(): Observable<T[]> {
    return using(new XLog(ServiceProxy.logger, levels.INFO, 'find'), (log) => {

      return Observable.create((observer: Subscriber<T[]>) => {
        //
        // aktuelle entityVersion ermitteln
        //
        this.entityVersionService.findById(this.getTableName()).subscribe((entityVersion) => {
          const cacheEntry = EntityVersionCache.instance.get(this.getTableName());

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
              updater(log, entityVersion, items, 'items never cached');
            });

          } else {

            //
            // Version veraltet? -> service call
            //
            if (cacheEntry.version < entityVersion.__version) {
              super.find().subscribe((items) => {
                updater(log, entityVersion, items, `replacing cached items ` +
                  `(versions: ${cacheEntry.version}, ${entityVersion.__version}`);
              });
            } else {
              // ... sonst Items aus cache
              updater(log, entityVersion, cacheEntry.items, `items already cached ` +
                `(versions: ${cacheEntry.version}, ${entityVersion.__version}`);
            }
          }

        });
      });
    });
  }



  public findById<T, TId>(id: TId): Observable<T> {
    return using(new XLog(ServiceProxy.logger, levels.INFO, 'findById'), (log) => {

      return Observable.create((observer: Subscriber<T>) => {
        //
        // findById immer durchführen, aber danach items und entityVersion aktualisieren
        //
        super.findById(id).subscribe((it) => {
          this.entityVersionService.findById(this.getTableName()).subscribe((entityVersion) => {
            const cacheEntry = EntityVersionCache.instance.get<T>(this.getTableName());

            if (cacheEntry) {
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
    return using(new XLog(ServiceProxy.logger, levels.INFO, 'delete'), (log) => {

      return Observable.create((observer: Subscriber<ServiceResult<TId>>) => {
        //
        // delete immer durchführen, aber danach items und entityVersion aktualisieren
        //
        super.delete(id).subscribe((result) => {
          this.entityVersionService.findById(this.getTableName()).subscribe((entityVersion) => {
            const cacheEntry = EntityVersionCache.instance.get<T>(this.getTableName());

            if (cacheEntry) {
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
    return using(new XLog(ServiceProxy.logger, levels.INFO, 'update'), (log) => {

      return Observable.create((observer: Subscriber<T>) => {
        //
        // update immer durchführen, aber danach items und entityVersion aktualisieren
        //
        super.update(item).subscribe((it) => {
          this.entityVersionService.findById(this.getTableName()).subscribe((entityVersion) => {
            const cacheEntry = EntityVersionCache.instance.get<T>(this.getTableName());

            if (cacheEntry) {
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