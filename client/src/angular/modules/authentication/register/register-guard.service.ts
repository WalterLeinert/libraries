import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router } from '@angular/router';

import { MessageService } from '../../../services/message.service';
import { CurrentUserBaseService } from '../currentUserBaseService';
import { PassportService } from '../passport.service';

/**
 * Guard-Service, der die Register-Route nur zulässt,
 * falls ein user angemeldet ist und dieser ein Admin ist.
 * 
 * @export
 * @class RegisterGuardService
 * @implements {CanActivate}
 */
@Injectable()
export class RegisterGuardService extends CurrentUserBaseService implements CanActivate {

  constructor(private _router: Router, messageService: MessageService, passportService: PassportService) {
    super(passportService, messageService);
  }

  public canActivate(route: ActivatedRouteSnapshot): boolean {
    if (this.userInternal && this.userInternal.isAdmin) {
      return true;
    }
    return false;
  }

}