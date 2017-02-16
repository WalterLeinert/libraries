import { EventEmitter, Output } from '@angular/core';


// -------------------------- logging -------------------------------
import { configure, getLogger, ILogger, levels, Logger, using, XLog } from '@fluxgate/common';
// -------------------------- logging -------------------------------

// Fluxgate
import { IUser } from '@fluxgate/common';


/**
 * abstrakte Basisklasse mit user-Property und change-detection
 * 
 * @export
 * @class CurrentUserBaseService
 */
export abstract class CurrentUser {
    protected static logger = getLogger(CurrentUser);

    private _user: IUser;
    @Output() public userChange: EventEmitter<IUser> = new EventEmitter();


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
        using(new XLog(CurrentUser.logger, levels.INFO, 'onUserChange',
            `user = ${JSON.stringify(user)}`), (log) => {
                this.userChange.emit(user);
            });
    }
}