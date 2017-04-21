// fluxgate
import { IRole } from '../model';
import { CommandStore, IServiceState, ReduxStore, ServiceCommand } from '../redux';


@ReduxStore()
export class RoleStoreFake extends CommandStore<IServiceState<IRole, number>> {
  public static ID = 'roleStoreFake';

  constructor() {
    super(RoleStoreFake.ID, ServiceCommand.INITIAL_STATE);
  }
}