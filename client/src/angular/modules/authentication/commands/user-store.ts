// fluxgate
import { IUser } from '@fluxgate/common';

import { CommandStore } from '../../../../redux/command-store';
import { ReduxStore } from '../../../../redux/decorators/redux-store.decorator';
import { ServiceCommand } from '../../../../redux/service-command';
import { IServiceState } from '../../../../redux/service-state.interface';


@ReduxStore()
export class UserStore extends CommandStore<IServiceState<IUser, number>> {
  public static ID = 'userStore';

  constructor() {
    super(UserStore.ID, ServiceCommand.INITIAL_STATE);
  }
}