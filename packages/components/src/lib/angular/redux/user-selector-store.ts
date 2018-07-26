// fluxgate
import {
  CommandStore, ExtendedCrudServiceRequests, IExtendedCrudServiceState, IUser, ReduxParentStore,
  UserStore
} from '@fluxgate/common';

export function parentUserStore() {
  return UserStore;
}

/**
 * CommandStore für einen User-Selector: hat zusätzlich zum UserStore noch currentItem
 */
@ReduxParentStore(parentUserStore)
export class UserSelectorStore extends CommandStore<IExtendedCrudServiceState<IUser, number>> {
  public static ID = 'userSelector';

  constructor(parent?: CommandStore<IExtendedCrudServiceState<IUser, number>>) {
    super(UserSelectorStore.ID, ExtendedCrudServiceRequests.INITIAL_STATE, parent);
  }
}