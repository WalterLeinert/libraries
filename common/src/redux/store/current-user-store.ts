// fluxgate
import { NotSupportedException } from '@fluxgate/core';

import { IUser } from '../../model/user.interface';
import { ICommand } from '../command/command.interface';
import { SetCurrentItemCommand } from '../command/set-current-item-command';
import { ReduxStore } from '../decorators/redux-store.decorator';
import { CrudServiceRequests } from '../service-requests/crud-service-requests';
import { ICrudServiceState } from '../state/crud-service-state.interface';
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
export class CurrentUserStore extends CommandStore<ICrudServiceState<IUser, number>> {
  public static ID = 'currentUserStore';

  constructor() {
    super(CurrentUserStore.ID, CrudServiceRequests.INITIAL_STATE);
  }

  public dispatch(command: ICommand<ICrudServiceState<IUser, number>>) {
    if (!(command instanceof SetCurrentItemCommand)) {
      throw new NotSupportedException(`storeId ${command.storeId}: command not supported ${JSON.stringify(command)}`);
    }

    super.dispatch(command);
  }

}