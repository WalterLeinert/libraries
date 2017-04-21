// fluxgate
import { CommandStore, IServiceState, ReduxStore, ServiceCommand } from '..';
import { IRole } from '../../model/role.interface';

@ReduxStore()
export class RoleStore extends CommandStore<IServiceState<IRole, number>> {
  public static ID = 'roleStore';

  constructor() {
    super(RoleStore.ID, ServiceCommand.INITIAL_STATE);
  }
}