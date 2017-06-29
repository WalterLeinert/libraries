import { ConfigBase } from '../../model/config-base';
import { ReduxStore } from '../decorators/redux-store.decorator';
import { ICrudServiceState } from '../state/crud-service-state.interface';
import { CommandStore } from '../store/command-store';
import { CrudServiceRequests } from './../service-requests/crud-service-requests';

/**
 * CommandStore für Konfigurationen
 *
 * @export
 * @class ConfigStore
 */
@ReduxStore()
export class ConfigStore extends CommandStore<ICrudServiceState<ConfigBase, string>> {
  public static ID = 'config';

  constructor() {
    super(ConfigStore.ID, CrudServiceRequests.INITIAL_STATE);
  }
}