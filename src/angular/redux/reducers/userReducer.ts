
import { Action } from 'redux';
import { createSelector } from 'reselect';

// fluxgate
import { IUser, User } from '@fluxgate/common';

import { ISetCurrentUserAction, UserActions } from '../actions';
import { IClientState } from '../client-state.interface';
import { IUserState } from './userState.interface';

/**
 * This file describes the state concerning Users, how to modify it through
 * the reducer, and the selectors.
 */


const initialState: IUserState = {
  currentUser: User.Null
};

export const UserReducer =
  (state: IUserState = initialState, action: Action): IUserState => {
    switch (action.type) {
      case UserActions.SET_CURRENT_USER:
        const user: IUser = (action as ISetCurrentUserAction).user;
        return {
          currentUser: user
        };
      default:
        return state;
    }
  };

export const getUserState = (state: IClientState): IUserState => state.user;

export const getCurrentUser = createSelector(
  getUserState,
  (state: IUserState) => state.currentUser);
