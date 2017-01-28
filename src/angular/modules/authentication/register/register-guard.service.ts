import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router } from '@angular/router';

// Fluxgate
import { IUser } from '@fluxgate/common';

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
export class RegisterGuardService implements CanActivate {
    private currentUser: IUser;

    constructor(private _router: Router, private passportService: PassportService) {
        this.passportService.currentUserChange.subscribe(user => {
            this.currentUser = user;
        });
    }

    canActivate(route: ActivatedRouteSnapshot): boolean {
        if (this.currentUser && this.currentUser.isAdmin) {
            return true;
        }
        return false;
    }

}