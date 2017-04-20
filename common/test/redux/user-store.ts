// fluxgate
import { IUser } from '../../src/model';
import { CommandStore, IServiceState, ReduxStore, ServiceCommand } from '../../src/redux';


@ReduxStore()
export class UserStore extends CommandStore<IServiceState<IUser, number>> {
  public static ID = 'userStore';

  constructor() {
    super(UserStore.ID, ServiceCommand.INITIAL_STATE);
  }
}