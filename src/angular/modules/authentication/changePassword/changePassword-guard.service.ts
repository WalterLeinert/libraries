import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router } from '@angular/router';

// Fluxgate
import { IUser } from '@fluxgate/common';

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
export class ChangePasswordGuardService implements CanActivate {
    private currentUser: IUser;

    constructor(private _router: Router, private passportService: PassportService) {
        this.passportService.currentUserChange.subscribe(user => {
            this.currentUser = user;
        });

        // initial aktuellen User ermitteln
        this.passportService.getCurrentUser().subscribe(
            user => this.currentUser = user
        );
    }

    canActivate(route: ActivatedRouteSnapshot): boolean {
        if (this.currentUser) {
            return true;
        }
        return false;
    }

}