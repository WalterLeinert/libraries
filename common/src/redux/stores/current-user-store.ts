// fluxgate
import { NotSupportedException } from '@fluxgate/core';

import { CommandStore, IServiceState, ReduxStore, ServiceCommand } from '..';
import { IUser } from '../../model/user.interface';
import { ICommand } from '../commands/command.interface';
import { SetCurrentItemCommand } from '../commands/set-current-item-command';


/**
 * Store der ausschliesslich den aktuellen User trackt.
 * Wird z.B. über Login/Logoff geändert.
 *
 * @export
 * @class CurrentUserStore
 * @extends {CommandStore<IServiceState<IUser, number>>}
 */
@ReduxStore()
export class CurrentUserStore extends CommandStore<IServiceState<IUser, number>> {
  public static ID = 'currentUserStore';

  constructor() {
    super(CurrentUserStore.ID, ServiceCommand.INITIAL_STATE);
  }

  public dispatch(command: ICommand<any>) {
    if (command instanceof SetCurrentItemCommand) {
      super.dispatch(command);
    }

    throw new NotSupportedException(`storeId ${command.storeId}: command not supported ${JSON.stringify(command)}`);
  }

}