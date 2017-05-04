import { ActivatedRouteSnapshot, Resolve, Router, RouterStateSnapshot } from '@angular/router';

import 'rxjs/add/observable/throw';
import 'rxjs/add/operator/catch';
import { Observable } from 'rxjs/Observable';

// Fluxgate
import { ICrudServiceRequests, IEntity } from '@fluxgate/common';
import { IToString } from '@fluxgate/core';

export abstract class ResolverBase<T extends IEntity<TId>, TId extends IToString> implements Resolve<T> {

  protected constructor(private serviceRequests: ICrudServiceRequests<T, TId>,
    private router: Router) {
  }

  public resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<T> {
    // tslint:disable-next-line:no-string-literal
    const id = route.params['id'];

    return this.serviceRequests.findById(id)
      .catch((error: Error) => {
        this.router.navigate(['/id']);
        return Observable.of(null);   // TODO
      });
  }
}