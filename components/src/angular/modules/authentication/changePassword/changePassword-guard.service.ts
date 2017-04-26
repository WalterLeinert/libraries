import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router } from '@angular/router';

// fluxgate
import { CoreComponent, MessageService } from '@fluxgate/client';
import { IUser } from '@fluxgate/common';


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
  private user: IUser;

  constructor(private _router: Router, messageService: MessageService) {
    super(messageService);

    this.user = this.getCurrentUser();
  }

  public canActivate(route: ActivatedRouteSnapshot): boolean {
    if (this.user) {
      return true;
    }
    return false;
  }

}