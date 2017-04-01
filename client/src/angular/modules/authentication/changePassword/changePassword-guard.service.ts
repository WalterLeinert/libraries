import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router } from '@angular/router';

// fluxgate
import { IUser } from '@fluxgate/common';

import { MessageService } from '../../../services/message.service';
import { CurrentUserBaseService } from '../currentUserBaseService';
import { PassportService } from '../passport.service';


/**
 * Guard-Service, der die PasswordChange-Route nur zulässt,
 * falls ein User angemeldet.
 * 
 * @export
 * @class PasswordChangeGuardService
 * @implements {CanActivate}
 */
@Injectable()
export class ChangePasswordGuardService extends CurrentUserBaseService implements CanActivate {
  private user: IUser;

  constructor(private _router: Router, messageService: MessageService, passportService: PassportService) {
    super(passportService, messageService);

    this.user = this.getCurrentUser();
  }

  public canActivate(route: ActivatedRouteSnapshot): boolean {
    if (this.user) {
      return true;
    }
    return false;
  }

}