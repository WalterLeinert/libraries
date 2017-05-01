import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router } from '@angular/router';

// fluxgate
import { CoreComponent, MessageService } from '@fluxgate/client';

/**
 * Guard-Service, der die Register-Route nur zulässt,
 * falls ein user angemeldet ist und dieser ein Admin ist.
 *
 * @export
 * @class RegisterGuardService
 * @implements {CanActivate}
 */
@Injectable()
export class RegisterGuardService extends CoreComponent implements CanActivate {

  constructor(private _router: Router, messageService: MessageService) {
    super(messageService);
  }

  public canActivate(route: ActivatedRouteSnapshot): boolean {
    if (this.currentUser && this.currentUser.isAdmin) {
      return true;
    }
    return false;
  }

}