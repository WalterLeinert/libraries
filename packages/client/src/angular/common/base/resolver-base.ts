import { ActivatedRouteSnapshot, Resolve, Router, RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs';
import { catchError, first, tap } from 'rxjs/operators';

// -------------------------------------- logging --------------------------------------------
// tslint:disable-next-line:no-unused-variable
import { getLogger, ILogger, levels, using, XLog } from '@fluxgate/platform';
// -------------------------------------- logging --------------------------------------------

// Fluxgate
import { ICrudServiceRequests, IEntity } from '@fluxgate/common';
import { Assert, ConverterRegistry, Core, Funktion, IToString } from '@fluxgate/core';


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
    private router: Router, private idType: string | Funktion) {
    Assert.notNull(idType);
  }

  public resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<T> {
    return using(new XLog(ResolverBase.logger, levels.INFO, 'resolve'), (log) => {
      // tslint:disable-next-line:no-string-literal
      const id = route.params['id'];

      const idConverter = ConverterRegistry.get<TId, string>(this.idType);
      const idConverted = idConverter.convertBack(id);


      if (log.isDebugEnabled()) {
        log.debug(`entity: ${this.serviceRequests.getModelClassName()}: id = ${id}`);
      }

      /**
       * Hinweis: first() ist wichtig!
       * "Currently the router waits for the observable to close.
       * You can ensure it gets closed after the first value is emitted, by using the first() operator."
       */
      return this.serviceRequests.findById(idConverted)
        .pipe(
          tap((item) => {
            if (log.isDebugEnabled()) {
              log.debug(`item = ${Core.stringify(item)}`);
            }
          }),
          first(),
          catchError<T, T>((error: Error) => {
            log.error(`error = ${error}`);
            return null;
          })
        );
    });
  }
}