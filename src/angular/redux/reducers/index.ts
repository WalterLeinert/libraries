import { combineReducers, Reducer } from 'redux';

import { IClientState } from '../client-state.interface';
import { UserReducer } from './userReducer';

export * from './userReducer';
export * from './userState.interface';

export const clientReducer: Reducer<IClientState> = combineReducers<IClientState>({
  users: UserReducer
});