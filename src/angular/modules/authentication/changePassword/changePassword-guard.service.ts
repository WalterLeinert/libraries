import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router } from '@angular/router';

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
 
    constructor(private _router: Router, passportService: PassportService) {
        super(passportService);
   }

    public canActivate(route: ActivatedRouteSnapshot): boolean {
        if (this.userInternal) {
            return true;
        }
        return false;
    }

}