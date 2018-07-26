// fluxgate
import {
  CommandStore, ExtendedCrudServiceRequests, IExtendedCrudServiceState, IRole, ReduxParentStore,
  RoleStore
} from '@fluxgate/common';


export function parentRoleStore() {
  return RoleStore;
}

/**
 * CommandStore für einen Role-Selector: hat zusätzlich zum RoleStore noch currentItem
 */
@ReduxParentStore(parentRoleStore)
export class RoleSelectorStore extends CommandStore<IExtendedCrudServiceState<IRole, number>> {
  public static ID = 'roleSelector';

  constructor(parent?: CommandStore<IExtendedCrudServiceState<IRole, number>>) {
    super(RoleSelectorStore.ID, ExtendedCrudServiceRequests.INITIAL_STATE, parent);
  }
}