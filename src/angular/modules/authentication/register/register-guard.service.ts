import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router } from '@angular/router';

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

    constructor(private _router: Router, passportService: PassportService) {
        super(passportService);
    }

    public canActivate(route: ActivatedRouteSnapshot): boolean {
        if (this.user && this.user.isAdmin) {
            return true;
        }
        return false;
    }

}