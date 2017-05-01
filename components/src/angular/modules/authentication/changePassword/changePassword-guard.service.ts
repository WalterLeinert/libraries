import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router } from '@angular/router';

// fluxgate
import { CoreComponent, MessageService } from '@fluxgate/client';

/**
 * Guard-Service, der die PasswordChange-Route nur zulässt,
 * falls ein User angemeldet.
 *
 * @export
 * @class PasswordChangeGuardService
 * @implements {CanActivate}
 */
@Injectable()
export class ChangePasswordGuardService extends CoreComponent implements CanActivate {

  constructor(private _router: Router, messageService: MessageService) {
    super(messageService);
  }

  public canActivate(route: ActivatedRouteSnapshot): boolean {
    if (this.currentStoreUser) {
      return true;
    }
    return false;
  }

}