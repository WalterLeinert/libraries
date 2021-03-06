import { IRole } from '../../model/role.interface';
import { ReduxStore } from '../decorators/redux-store.decorator';
import { ICrudServiceState } from '../state/crud-service-state.interface';
import { CommandStore } from '../store/command-store';
import { CrudServiceRequests } from './../service-requests/crud-service-requests';

@ReduxStore()
export class RoleStore extends CommandStore<ICrudServiceState<IRole, number>> {
  public static ID = 'role';

  constructor() {
    super(RoleStore.ID, CrudServiceRequests.INITIAL_STATE);
  }
}