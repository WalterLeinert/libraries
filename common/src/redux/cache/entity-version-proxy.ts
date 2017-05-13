import { Observable } from 'rxjs/Observable';
import { Subscriber } from 'rxjs/Subscriber';


// -------------------------------------- logging --------------------------------------------
// tslint:disable-next-line:no-unused-variable
import { getLogger, ILogger, levels, using, XLog } from '@fluxgate/platform';
// -------------------------------------- logging --------------------------------------------

import { IQuery } from '@fluxgate/core';

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
      return super.create(item);
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

          const updater = (ev, items, message) => {
            if (log.isDebugEnabled()) {
              log.debug(message);
            }

            const updatedCacheEnty = new EntityVersionCacheEntry<T>(ev, items);
            EntityVersionCache.instance.add(this.getTableName(), updatedCacheEnty);
            observer.next(items);
          };

          //
          // noch nichts im Cache? -> immer service call
          //
          if (!cacheEntry) {
            super.find().subscribe((items) => {
              updater(entityVersion, items, 'items never cached');
            });

          } else {

            //
            // Version veraltet? -> service call
            //
            if (cacheEntry.entityVersion.__version < entityVersion.__version) {
              super.find().subscribe((items) => {
                updater(entityVersion, items, `replacing cached items (versions: ${cacheEntry.entityVersion.__version}, ` +
                  `${entityVersion.__version}`);
              });
            } else {
              // ... sonst Items aus cache
              updater(entityVersion, cacheEntry.items, `items already cached (versions: ${cacheEntry.entityVersion.__version}, ` +
                `${entityVersion.__version}`);
            }
          }

        });
      });
    });
  }

  public findById<T, TId>(id: TId): Observable<T> {
    return using(new XLog(ServiceProxy.logger, levels.INFO, 'findById'), (log) => {
      return super.findById(id);
    });
  }

  public delete<TId>(id: TId): Observable<ServiceResult<TId>> {
    return using(new XLog(ServiceProxy.logger, levels.INFO, 'delete'), (log) => {
      return super.delete(id);
    });
  }

  public update<T>(item: T): Observable<T> {
    return using(new XLog(ServiceProxy.logger, levels.INFO, 'update'), (log) => {
      return super.update(item);
    });
  }
}