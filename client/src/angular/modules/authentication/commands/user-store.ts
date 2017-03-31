// fluxgate
import { IUser } from '@fluxgate/common';

import { CommandStore } from '../../../../redux/commandStore';
import { ServiceCommand } from '../../../../redux/service-command';
import { IServiceState } from '../../../../redux/service-state.interface';


export class UserStore extends CommandStore<IServiceState<IUser, number>> {
  public static ID = 'userStore';

  constructor() {
    super(UserStore.ID, ServiceCommand.INITIAL_STATE);
  }
}