import { Injectable, NgModule } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, CanDeactivate, Router, RouterStateSnapshot } from '@angular/router';



import { Observable } from 'rxjs';

// Fluxgate
import { CoreComponent, MessageService, } from '@fluxgate/client';


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
export class ComponentGuardService<T extends CoreComponent> extends CoreComponent
  implements CanActivate, CanDeactivate<T>  {

  constructor(private _router: Router, messageService: MessageService) {
    super(messageService);
  }


  public canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot):
    Observable<boolean> | Promise<boolean> | boolean {
    return true;
  }

  public canDeactivate(component: T, route: ActivatedRouteSnapshot, state: RouterStateSnapshot):
    Observable<boolean> | Promise<boolean> | boolean {

    return new Promise<boolean>((resolve, reject) => {
      if (component.hasChanges()) {
        this.confirmationService.confirm({
          header: 'Unsaved Changes',
          message: 'You have unsaved changes: OK to discard?',
          accept: () => resolve(true),
          reject: () => resolve(false)
        });
      } else {
        resolve(true);
      }
    });
  }
}



// tslint:disable-next-line:max-classes-per-file
@NgModule({
  providers: [
    ComponentGuardService
  ]
})
export class ComponentGuardModule { }