import { ActivatedRouteSnapshot, Resolve, Router, RouterStateSnapshot } from '@angular/router';

import 'rxjs/add/operator/first';
import { Observable } from 'rxjs/Observable';

// -------------------------------------- logging --------------------------------------------
// tslint:disable-next-line:no-unused-variable
import { getLogger, ILogger, levels, using, XLog } from '@fluxgate/platform';
// -------------------------------------- logging --------------------------------------------

// Fluxgate
import { ICoreServiceRequests } from '@fluxgate/common';
import { Assert, Core, Query, SelectorTerm } from '@fluxgate/core';


/**
 * abstrakte Basisklasse für alle Resolver, die mit ServiceRequests über eine Query ein Item auflösen.
 * Die Queryparameter (attribute, operator, value) müssen als Route Parameter angegeben sein.
 * Der Route-Parameter operator kann fehlen und hat den Defaultwert '='.
 *
 * @export
 * @abstract
 * @class QueryResolver
 * @implements {Resolve<T>}
 * @template T
 * @template TId
 *
 */
export abstract class QueryResolver<T> implements Resolve<T> {
  protected static readonly logger = getLogger(QueryResolver);

  protected constructor(private serviceRequests: ICoreServiceRequests<T>, private router: Router,
    private attribute?: string, private operator?: string) {
    Assert.notNull(serviceRequests);
    Assert.notNull(router);
  }


  public resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<T> {
    return using(new XLog(QueryResolver.logger, levels.INFO, 'resolve'), (log) => {

      // tslint:disable-next-line:no-string-literal
      const id = route.params['id'];

      // tslint:disable-next-line:no-string-literal
      const attribute = route.params['attribute'] ? route.params['attribute'] : this.attribute;
      // tslint:disable-next-line:no-string-literal
      const operator = route.params['operator'] ? route.params['operator'] : (this.operator ? this.operator : '=');
      // tslint:disable-next-line:no-string-literal
      const value = route.params['value'] ? route.params['value'] : id;

      const query = new Query(
        new SelectorTerm({
          name: attribute,
          operator: operator,
          value: value
        })
      );

      if (log.isDebugEnabled()) {
        log.debug(`entity: ${this.serviceRequests.getModelClassName()}: query = ${Core.stringify(query)}`);
      }

      /**
       * Hinweis: first() ist wichtig!
       * "Currently the router waits for the observable to close.
       * You can ensure it gets closed after the first value is emitted, by using the first() operator."
       */
      return this.serviceRequests.query(query)
        .do((items) => {
          if (log.isDebugEnabled()) {
            log.debug(`items = ${Core.stringify(items)}`);
          }
        })
        .map((items) => items[0])
        .first()
        .catch((error: Error) => {
          log.error(`error = ${error}`);
          return Observable.throw(error);
        });
    });
  }
}