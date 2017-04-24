// fluxgate
import { NotSupportedException } from '@fluxgate/core';

import { IUser } from '../../model/user.interface';
import { ICommand } from '../command/command.interface';
import { SetCurrentItemCommand } from '../command/set-current-item-command';
import { ReduxStore } from '../decorators/redux-store.decorator';
import { CurrentItemServiceRequests } from '../service-requests/current-item-service-requests';
import { ICurrentItemServiceState } from '../state/current-item-service-state.interface';
import { CommandStore } from '../store';


/**
 * Store der ausschliesslich den aktuellen User trackt.
 * Wird z.B. über Login/Logoff geändert.
 *
 * @export
 * @class CurrentUserStore
 * @extends {CommandStore<IServiceState<IUser, number>>}
 */
@ReduxStore()
export class CurrentUserStore extends CommandStore<ICurrentItemServiceState<IUser, number>> {
  public static ID = 'currentUserStore';

  constructor() {
    super(CurrentUserStore.ID, CurrentItemServiceRequests.INITIAL_STATE);
  }

  public dispatch(command: ICommand<ICurrentItemServiceState<IUser, number>>) {
    if (!(command instanceof SetCurrentItemCommand)) {
      throw new NotSupportedException(`storeId ${command.storeId}: command not supported ${JSON.stringify(command)}`);
    }

    super.dispatch(command);
  }

}