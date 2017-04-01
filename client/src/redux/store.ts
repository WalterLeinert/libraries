
// -------------------------------------- logging --------------------------------------------
// tslint:disable-next-line:no-unused-variable
import { getLogger, ILogger, levels, using, XLog } from '@fluxgate/common';
// -------------------------------------- logging --------------------------------------------

import { Assert, InvalidOperationException } from '@fluxgate/common';

import { CustomSubject } from '@fluxgate/common';

import { ICommand } from './command.interface';
import { CommandStore } from './commandStore';

/**
 * Modelliert den Store beim redux/command Pattern.
 * Der Store enthält mehrere @see{CommandStore}s für verschiedene Aspekte
 * wie z.B. Rest-Services
 * 
 * @export
 * @class Store
 */
export class Store {
  protected static readonly logger = getLogger(Store);
  private commandStores: { [storeName: string]: CommandStore<any> } = {};

  /**
   * Creates an instance of Store.
   * 
   * @memberOf Store
   */
  constructor() {
    using(new XLog(Store.logger, levels.INFO, 'ctor'), (log) => {
      // ok
    });
  }

  /**
   * Fügt den command store @param{store} zum Store hinzu
   * 
   * @param {CommandStore<any>} store 
   * 
   * @memberOf Store
   */
  public add(store: CommandStore<any> | Array<CommandStore<any>>): void {
    Assert.notNull(store);
    if (Array.isArray(store)) {
      this.addInternal(store);
    } else {
      this.addInternal([store]);
    }
  }

  public dispatch(command: ICommand<any>) {
    Assert.notNull(command);

    using(new XLog(Store.logger, levels.INFO, 'dispatch'), (log) => {
      const commandStore = this.commandStores[command.storeId];
      commandStore.dispatch(command);
    });
  }

  /**
   * Liefert den Status des Stores mit der Id @param{storeId}.
   * 
   * @template T
   * @param {string} storeId
   * @returns {T}
   * 
   * @memberOf Store
   */
  public getState<T>(storeId: string): T {
    Assert.notNullOrEmpty(storeId);
    const commandStore = this.commandStores[storeId];
    return commandStore.getState();
  }


  /**
   * Liefert das Subject für die Id @param{storeId} für eine anschliessende Subscription.
   * 
   * @param {string} storeId
   * @returns {CustomSubject<any>}
   * 
   * @memberOf Store
   */
  public subject(storeId: string): CustomSubject<any> {
    Assert.notNullOrEmpty(storeId);
    const commandStore = this.commandStores[storeId];
    return commandStore.subject();
  }


  /**
   * Fügt die command stores dem Store hinzu
   * 
   * @param {Array<CommandStore<any>>} stores
   * 
   * @memberOf Store
   */
  private addInternal(stores: Array<CommandStore<any>>) {
    Assert.notNullOrEmpty(stores);

    stores.forEach((store) => {
      if (this.commandStores[store.name]) {
        throw new InvalidOperationException(`Store enthält bereits einen CommandStore ${store.name}`);
      }
      this.commandStores[store.name] = store;
    });
  }

}