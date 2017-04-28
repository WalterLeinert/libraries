import { IUser } from '../../model/user.interface';
import { ReduxStore } from '../decorators/redux-store.decorator';
import { ICrudServiceState } from '../state/crud-service-state.interface';
import { CommandStore } from '../store';
import { CrudServiceRequests } from './../service-requests/crud-service-requests';


@ReduxStore()
export class UserStore extends CommandStore<ICrudServiceState<IUser, number>> {
  public static ID = 'userStore';

  constructor() {
    super(UserStore.ID, CrudServiceRequests.INITIAL_STATE);
  }
}