// fluxgate
import { IUser } from '@fluxgate/common';
import { CommandStore, IServiceState, ReduxStore, ServiceCommand } from '@fluxgate/common';


@ReduxStore()
export class UserStore extends CommandStore<IServiceState<IUser, number>> {
  public static ID = 'userStore';

  constructor() {
    super(UserStore.ID, ServiceCommand.INITIAL_STATE);
  }
}