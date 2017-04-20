// fluxgate
import { IRole } from '@fluxgate/common';
import { CommandStore, IServiceState, ReduxStore, ServiceCommand } from '@fluxgate/common';

@ReduxStore()
export class RoleStore extends CommandStore<IServiceState<IRole, number>> {
  public static ID = 'roleStore';

  constructor() {
    super(RoleStore.ID, ServiceCommand.INITIAL_STATE);
  }
}