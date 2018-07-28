import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve, Router, RouterStateSnapshot } from '@angular/router';

import { Observable } from 'rxjs';
import { catchError, first, map, tap } from 'rxjs/operators';

// -------------------------------------- logging --------------------------------------------
// tslint:disable-next-line:no-unused-variable
import { getLogger, ILogger, levels, using, XLog } from '@fluxgate/platform';
// -------------------------------------- logging --------------------------------------------

import { ConfigBase } from '@fluxgate/common';
import { ConfigService } from '@fluxgate/components';
import { Assert } from '@fluxgate/core';


@Injectable()
export class ConfigurationResolver implements Resolve<ConfigBase> {
  protected static readonly logger = getLogger(ConfigurationResolver);

  constructor(private service: ConfigService<ConfigBase>, router: Router) {
  }

  public resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<ConfigBase> {
    return using(new XLog(ConfigurationResolver.logger, levels.INFO, 'resolve'), (log) => {

      // tslint:disable-next-line:no-string-literal
      const id = route.params['id'] as string;
      Assert.notNull(id);

      //
      // Hinweis: first() ist wichtig!
      // "Currently the router waits for the observable to close.
      // You can ensure it gets closed after the first value is emitted, by using the first() operator."
      //
      return this.service.findById(id)
        .pipe(
          tap((item) => {
            if (log.isDebugEnabled()) {
              log.debug(`item = ${JSON.stringify(item)}`);
            }
          }),
          first(),
          map((item) => item.item),

          catchError<ConfigBase, any>((error: Error) => {
            log.error(`error = ${error}`);
            return null;
          })
        );
    });
  }
}