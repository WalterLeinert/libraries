import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve, Router, RouterStateSnapshot } from '@angular/router';

import 'rxjs/add/observable/throw';
import 'rxjs/add/operator/catch';
import { Observable } from 'rxjs/Observable';

import { Service } from '../../services/service';



@Injectable()
export abstract class ResolverBase<T, TId> implements Resolve<T> {

  protected constructor(private service: Service<T, TId>, private router: Router) {
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