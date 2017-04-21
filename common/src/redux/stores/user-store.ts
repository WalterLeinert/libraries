// fluxgate
import { CommandStore, IServiceState, ReduxStore, ServiceCommand } from '..';
import { IUser } from '../../model/user.interface';


@ReduxStore()
export class UserStore extends CommandStore<IServiceState<IUser, number>> {
  public static ID = 'userStore';

  constructor() {
    super(UserStore.ID, ServiceCommand.INITIAL_STATE);
  }
}