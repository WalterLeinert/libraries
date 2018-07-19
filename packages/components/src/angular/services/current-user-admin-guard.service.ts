import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate } from '@angular/router';

// fluxgate
import { MessageService } from '@fluxgate/client';

import { CurrentUserGuardService } from './current-user-guard.service';

/**
 * Guard-Service, der sicher stellt, dass ein aktueller User existiert und dieser Admin ist.
 *
 * @export
 * @class CurrentUserAdminGuardService
 * @implements {CanActivate}
 */
@Injectable()
export class CurrentUserAdminGuardService extends CurrentUserGuardService implements CanActivate {

  constructor(messageService: MessageService) {
    super(messageService);
  }

  public canActivate(route: ActivatedRouteSnapshot): boolean {
    const rval = super.canActivate(route);
    if (!rval) {
      return false;
    }

    if (this.currentStoreUser.isAdmin) {
      return true;
    }
    return false;
  }

}