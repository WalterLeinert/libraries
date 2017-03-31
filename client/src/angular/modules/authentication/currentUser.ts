import { EventEmitter, Output } from '@angular/core';


// -------------------------- logging -------------------------------
// tslint:disable-next-line:no-unused-variable
import { getLogger, ILogger, levels, using, XLog } from '@fluxgate/common';
// -------------------------- logging -------------------------------

// Fluxgate
import { IUser } from '@fluxgate/common';

import { CoreComponent } from '../../common/base';


/**
 * abstrakte Basisklasse mit user-Property und change-detection
 * 
 * @export
 * @class CurrentUserBaseService
 */
export abstract class CurrentUser extends CoreComponent {
  protected static logger = getLogger(CurrentUser);

  private _userInternal: IUser;
  @Output() public userChange: EventEmitter<IUser> = new EventEmitter();

  /**
   * Liefert den aktuell angemeldeten User.
   * 
   * @readonly
   * @type {IUser}
   * @memberOf CurrentUserService
   */
  public get user(): IUser {
    return this._userInternal;
  }


  protected get userInternal(): IUser {
    return this._userInternal;
  }

  protected set userInternal(value: IUser) {
    if (this._userInternal !== value) {
      this._userInternal = value;
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