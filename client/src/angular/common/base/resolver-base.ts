import { ActivatedRouteSnapshot, Resolve, Router, RouterStateSnapshot } from '@angular/router';

import 'rxjs/add/operator/first';
import { Observable } from 'rxjs/Observable';

// Fluxgate
import { ICrudServiceRequests, IEntity } from '@fluxgate/common';
import { IToString } from '@fluxgate/core';


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

  protected constructor(private serviceRequests: ICrudServiceRequests<T, TId>,
    private router: Router) {
  }

  public resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<T> {
    // tslint:disable-next-line:no-string-literal
    const id = route.params['id'];

    /**
     * Hinweis: first() ist wichtig!
     * "Currently the router waits for the observable to close.
     * You can ensure it gets closed after the first value is emitted, by using the first() operator."
     */
    return this.serviceRequests.findById(id).first();
  }
}