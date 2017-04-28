// fluxgate
import {
  CommandStore, ExtendedCrudServiceRequests, IExtendedCrudServiceState, IUser, ReduxParentStore,
  UserStore
} from '@fluxgate/common';


/**
 * CommandStore für einen User-Selector: hat zusätzlich zum RoleStore noch currentItem
 *
 * @export
 * @class UserSelectorStore
 * @extends {CommandStore<IExtendedCrudServiceState<IUser, number>>}
 */
@ReduxParentStore(() => UserStore)
export class UserSelectorStore extends CommandStore<IExtendedCrudServiceState<IUser, number>> {
  public static ID = 'userSelectorStore';

  constructor() {
    super(UserSelectorStore.ID, ExtendedCrudServiceRequests.INITIAL_STATE);
  }
}