import { ISystemConfig } from '../../model/system-config.interface';
import { ReduxStore } from '../decorators/redux-store.decorator';
import { ICrudServiceState } from '../state/crud-service-state.interface';
import { CommandStore } from '../store';
import { CrudServiceRequests } from './../service-requests/crud-service-requests';

@ReduxStore()
export class SystemConfigStore extends CommandStore<ICrudServiceState<ISystemConfig, string>> {
  public static ID = 'systemConfig';

  constructor() {
    super(SystemConfigStore.ID, CrudServiceRequests.INITIAL_STATE);
  }
}