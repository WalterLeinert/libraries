import { EventEmitter, Output } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router } from '@angular/router';

import { Observable } from 'rxjs/Observable';

// -------------------------- logging -------------------------------
import { configure, getLogger, ILogger, levels, Logger, using, XLog } from '@fluxgate/common';
// -------------------------- logging -------------------------------

// Fluxgate
import { IUser } from '@fluxgate/common';

import { PassportService } from './passport.service';


/**
 * abstrakte Service-Basisklasse zum Überwachen des angemeldeten Users mittels @see{PassportService}. 
 * 
 * @export
 * @class CurrentUserBaseService
 */
export abstract class CurrentUserBaseService {
    protected static logger = getLogger(CurrentUserBaseService);

    private _user: IUser;

    @Output() public userChange: EventEmitter<IUser> = new EventEmitter();


    protected constructor(private passportService: PassportService) {
        using(new XLog(CurrentUserBaseService.logger, levels.INFO, 'ctor'), (log) => {
            this.passportService.currentUserChange.subscribe((user) => {
                this.user = user;
                log.debug(`currentUserChange: user = ${JSON.stringify(user)}`);
            });

            // initial aktuellen User ermitteln
            this.passportService.getCurrentUser().subscribe((user) => {
                this.user = user;
                log.debug(`getCurrentUser: user = ${JSON.stringify(user)}`);
            });
        });
    }


    /**
     * Liefert den aktuell angemeldeten User.
     * 
     * @readonly
     * @type {IUser}
     * @memberOf CurrentUserService
     */
    public get user(): IUser {
        return this._user;
    }

    public set user(value: IUser) {
        if (this._user !== value) {
            this._user = value;
            this.onUserChange(value);
        }
    }


    protected onUserChange(user: IUser) {
        using(new XLog(CurrentUserBaseService.logger, levels.INFO, 'onUserChange',
            `user = ${JSON.stringify(user)}`), (log) => {
                this.userChange.emit(user);
            });
    }
}