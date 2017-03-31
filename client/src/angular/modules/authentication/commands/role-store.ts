// fluxgate
import { IRole } from '@fluxgate/common';

import { CommandStore } from '../../../../redux/commandStore';
import { ServiceCommand } from '../../../../redux/service-command';
import { IServiceState } from '../../../../redux/service-state.interface';


export class RoleStore extends CommandStore<IServiceState<IRole, number>> {
  public static ID = 'roleStore';

  constructor() {
    super(RoleStore.ID, ServiceCommand.INITIAL_STATE);
  }
}