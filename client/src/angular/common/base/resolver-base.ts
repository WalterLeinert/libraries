import { ActivatedRouteSnapshot, Resolve, Router, RouterStateSnapshot } from '@angular/router';

import 'rxjs/add/observable/throw';
import 'rxjs/add/operator/catch';
import { Observable } from 'rxjs/Observable';

// Fluxgate
import { IService } from '@fluxgate/common';

export abstract class ResolverBase<T, TId> implements Resolve<T> {

  protected constructor(private service: IService<T, TId>, private router: Router) {
  }

  public resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<T> {
    // tslint:disable-next-line:no-string-literal
    const id = route.params['id'];

    return this.service.findById(id)
      .catch((error: Error) => {
        this.router.navigate(['/id']);
        return Observable.of(null);   // TODO
      });
  }
}