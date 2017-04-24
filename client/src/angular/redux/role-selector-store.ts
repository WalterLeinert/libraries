// fluxgate
import {
  CommandStore, ExtendedCrudServiceRequests, IExtendedCrudServiceState, IRole, ReduxParentStore,
  RoleStore
} from '@fluxgate/common';


/**
 * CommandStore für einen Role-Selector: hat zusätzlich zum RoleStore noch currentItem
 *
 * @export
 * @class RoleSelectorStore
 * @extends {CommandStore<IExtendedCrudServiceState<IRole, number>>}
 */
@ReduxParentStore(RoleStore)
export class RoleSelectorStore extends CommandStore<IExtendedCrudServiceState<IRole, number>> {
  public static ID = 'roleSelectorStore';

  constructor() {
    super(RoleSelectorStore.ID, ExtendedCrudServiceRequests.INITIAL_STATE);
  }
}