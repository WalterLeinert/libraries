import { Action, ActionCreator } from 'redux';

// fluxgate
import { IUser } from '@fluxgate/common';

/**
 * UserActions specifies action creators concerning Users
 */

export interface ISetCurrentUserAction extends Action {
  user: IUser;
}

export class UserActions {
  public static readonly SET_CURRENT_USER = '[User] Set Current';


  public static readonly setCurrentUser: ActionCreator<ISetCurrentUserAction> =
  (user) => ({
    type: UserActions.SET_CURRENT_USER,
    user: user
  })
}