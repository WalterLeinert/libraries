// fluxgate
import {
  CommandStore, ExtendedCrudServiceRequests, IExtendedCrudServiceState, IRole, ReduxParentStore,
  RoleStore
} from '@fluxgate/common';


/**
 * CommandStore für einen Role-Selector: hat zusätzlich zum RoleStore noch currentItem
 */
@ReduxParentStore(RoleStore)
export class RoleSelectorStore extends CommandStore<IExtendedCrudServiceState<IRole, number>> {
  public static ID = 'roleSelector';

  constructor(parent?: CommandStore<IExtendedCrudServiceState<IRole, number>>) {
    super(RoleSelectorStore.ID, ExtendedCrudServiceRequests.INITIAL_STATE, parent);
  }
}