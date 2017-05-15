import { ActivatedRouteSnapshot, Resolve, Router, RouterStateSnapshot } from '@angular/router';

import 'rxjs/add/operator/first';
import { Observable } from 'rxjs/Observable';

// -------------------------------------- logging --------------------------------------------
// tslint:disable-next-line:no-unused-variable
import { getLogger, ILogger, levels, using, XLog } from '@fluxgate/platform';
// -------------------------------------- logging --------------------------------------------

// Fluxgate
import { ICrudServiceRequests, IEntity } from '@fluxgate/common';
import { Assert, ConverterRegistry, IToString } from '@fluxgate/core';


/**
 * abstrakte Basisklasse für alle Resolver, die mit ServiceRequests arbeiten
 *
 * @export
 * @abstract
 * @class ResolverBase
 * @implements {Resolve<T>}
 * @template T
 * @template TId
 *
 */
export abstract class ResolverBase<T extends IEntity<TId>, TId extends IToString> implements Resolve<T> {
  protected static readonly logger = getLogger(ResolverBase);


  protected constructor(private serviceRequests: ICrudServiceRequests<T, TId>,
    private router: Router, private idType: string | Function) {
    Assert.notNull(idType);
  }

  public resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<T> {
    return using(new XLog(ResolverBase.logger, levels.INFO, 'resolve'), (log) => {
      // tslint:disable-next-line:no-string-literal
      const id = route.params['id'];

      const idConverter = ConverterRegistry.get<TId, string>(this.idType);
      const idConverted = idConverter.convertBack(id);


      /**
       * Hinweis: first() ist wichtig!
       * "Currently the router waits for the observable to close.
       * You can ensure it gets closed after the first value is emitted, by using the first() operator."
       */
      return this.serviceRequests.findById(idConverted)
        .first()
        .catch((error: Error) => {
          log.error(`error = ${error}`);
          return null;
        });
    });
  }
}