// fluxgate
import { IUser } from '../model';
import { CommandStore, IServiceState, ReduxStore, ServiceCommand } from '../redux';


@ReduxStore()
export class UserStoreFake extends CommandStore<IServiceState<IUser, number>> {
  public static ID = 'userStoreFake';

  constructor() {
    super(UserStoreFake.ID, ServiceCommand.INITIAL_STATE);
  }
}