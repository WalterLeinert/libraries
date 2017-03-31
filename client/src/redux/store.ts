
// -------------------------------------- logging --------------------------------------------
// tslint:disable-next-line:no-unused-variable
import { getLogger, ILogger, levels, using, XLog } from '@fluxgate/common';
// -------------------------------------- logging --------------------------------------------

import { Utility } from '@fluxgate/common';

import { CustomSubject } from '@fluxgate/common';

import { ICommand } from './command.interface';
import { CommandStore } from './commandStore';

export class Store {
  protected static readonly logger = getLogger(Store);
  private commandStores: { [storeName: string]: CommandStore<any> } = {};

  constructor(stores: Array<CommandStore<any>>) {
    using(new XLog(Store.logger, levels.INFO, 'ctor'), (log) => {
      this.combine(stores);
    });
  }

  public dispatch(command: ICommand<any>) {
    using(new XLog(Store.logger, levels.INFO, 'dispatch'), (log) => {
      const commandStore = this.commandStores[command.storeId];
      commandStore.dispatch(command);
    });
  }

  public getState<T>(storeId: string): T {
    const commandStore = this.commandStores[storeId];
    return commandStore.getState();
  }

  public subject(storeId: string): CustomSubject<any> {
    const commandStore = this.commandStores[storeId];
    return commandStore.subject();
  }

  public combine(stores: Array<CommandStore<any>>) {
    if (!Utility.isNullOrEmpty(stores)) {
      stores.forEach((store) => this.commandStores[store.name] = store);
    }
  }

}