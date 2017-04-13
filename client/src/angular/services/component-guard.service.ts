import { Injectable, NgModule } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, CanDeactivate, Router, RouterStateSnapshot } from '@angular/router';

import 'rxjs/add/observable/of';
import { Observable } from 'rxjs/Observable';

// Fluxgate
import { IServiceBase } from '@fluxgate/common';

import { BaseComponent } from '../common/base/base.component';
import { ConfirmationDialogComponent, ConfirmationDialogModule } from '../modules/common';


/**
 * Guard-Service: dient zur Abfrage für ungespeicherte Änderungen in einer zugehörigen Komponente
 *
 * @export
 * @class ComponentGuardService
 * @implements {CanActivate}
 * @implements {CanDeactivate<T>}
 * @template T
 * @template TService
 */
@Injectable()
export class ComponentGuardService<T extends BaseComponent<TService>, TService extends IServiceBase>
  implements CanActivate, CanDeactivate<T>  {

  constructor(private _router: Router /*, private _confirmationDialog: ConfirmationDialogComponent*/) {
  }


  public canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot):
    Observable<boolean> | Promise<boolean> | boolean {

    return true;
  }

  public canDeactivate(component: T, route: ActivatedRouteSnapshot, state: RouterStateSnapshot):
    Observable<boolean> | Promise<boolean> | boolean {

    if (component.hasChanges()) {

      // TODO: geht so nicht, weil confirmAction nicht blockt.
      // let confirm = false;
      // component.confirmAction({
      //   header: 'Unsaved Changes',
      //   message: 'You have unsaved changes: OK to discard?'
      // }, () => confirm = true);
      // return confirm;


      return confirm('You have unsaved changes: OK to discard?');     // TODO: durch eigenen Dialog ersetzen
    } else {
      return true;
    }
  }
}



// tslint:disable-next-line:max-classes-per-file
@NgModule({
  imports: [
    ConfirmationDialogModule
  ],
  exports: [
    ConfirmationDialogComponent
  ],
  providers: [
    ComponentGuardService
  ]
})
export class ComponentGuardModule { }