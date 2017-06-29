import { ActivatedRouteSnapshot, Resolve, Router, RouterStateSnapshot } from '@angular/router';

import 'rxjs/add/operator/first';
import { Observable } from 'rxjs/Observable';

// -------------------------------------- logging --------------------------------------------
// tslint:disable-next-line:no-unused-variable
import { getLogger, ILogger, levels, using, XLog } from '@fluxgate/platform';
// -------------------------------------- logging --------------------------------------------

// Fluxgate
import { IEntity, IService } from '@fluxgate/common';
import { Assert, ConverterRegistry, Funktion, IToString } from '@fluxgate/core';


/**
 * abstrakte Basisklasse für alle Resolver, die mit Services arbeiten
 *
 * @export
 * @abstract
 * @class ServiceResolver
 * @implements {Resolve<T>}
 * @template T
 * @template TId
 *
 */
export abstract class ServiceResolver<T extends IEntity<TId>, TId extends IToString> implements Resolve<T> {
  protected static readonly logger = getLogger(ServiceResolver);


  protected constructor(private service: IService<T, TId>,
    private router: Router, private idType: string | Funktion) {
    Assert.notNull(idType);
  }

  public resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<T> {
    return using(new XLog(ServiceResolver.logger, levels.INFO, 'resolve'), (log) => {
      // tslint:disable-next-line:no-string-literal
      const id = route.params['id'];

      const idConverter = ConverterRegistry.get<TId, string>(this.idType);
      const idConverted = idConverter.convertBack(id);


      if (log.isDebugEnabled()) {
        log.debug(`entity: ${this.service.getModelClassName()}: id = ${id}`);
      }

      return this.findById(idConverted);
    });
  }


  protected findById(id: TId): Observable<T> {
    return using(new XLog(ServiceResolver.logger, levels.INFO, 'resolve'), (log) => {
      //
      // Hinweis: first() ist wichtig!
      // "Currently the router waits for the observable to close.
      // You can ensure it gets closed after the first value is emitted, by using the first() operator."
      //
      return this.service.findById(id)
        .do((item) => {
          if (log.isDebugEnabled()) {
            log.debug(`item = ${JSON.stringify(item)}`);
          }
        })
        .first()
        .catch((error: Error) => {
          log.error(`error = ${error}`);
          return null;
        });
    });
  }
}