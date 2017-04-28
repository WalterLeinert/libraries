import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router } from '@angular/router';

// fluxgate
import { CoreComponent } from '@fluxgate/client';
import { IUser } from '@fluxgate/common';

import { MessageService } from '../../../services/message.service';


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
  private user: IUser;

  constructor(private _router: Router, messageService: MessageService) {
    super(messageService);

    this.user = this.getCurrentUser();
  }

  public canActivate(route: ActivatedRouteSnapshot): boolean {
    if (this.user && this.user.isAdmin) {
      return true;
    }
    return false;
  }

}