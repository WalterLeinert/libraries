// -------------------------- logging -------------------------------
// tslint:disable-next-line:no-unused-variable
import { getLogger, ILogger, levels, using, XLog } from '@fluxgate/platform';
// -------------------------- logging -------------------------------

import { Assert, CustomSubject, Dictionary, InvalidOperationException, Types } from '@fluxgate/core';

import { ICommand } from '../command/command.interface';
import { CurrentItemCommand } from '../command/current-item-command';
import { CommandStoreStorage } from '../decorators/command-store-storage';
import { IServiceState } from '../state/service-state.interface';
import { CommandStore } from './command-store';

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
  private commandStores: Dictionary<string, CommandStore<any>> = new Dictionary<string, CommandStore<any>>();

  /**
   * Creates an instance of Store.
   * @param {Array<CommandStore<any>>} stores
   *
   * @memberOf Store
   */
  constructor() {
    using(new XLog(Store.logger, levels.INFO, 'ctor'), (log) => {
      CommandStoreStorage.instance.registerStores(this);
    });
  }

  /**
   *
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
      const commandStore = this.getCommandStore(command.storeId);
      let store = commandStore;

      // CurrentItemCommands arbeiten nicht auf Parentstores!
      if (!(command instanceof CurrentItemCommand)) {

        // root CommandStore suchen
        while (Types.isPresent(store.parent)) {
          store = store.parent;
        }
      }

      // ... und command dort dispatchen
      store.dispatch(command);
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
  public getState(storeId: string): IServiceState {
    Assert.notNullOrEmpty(storeId);
    const commandStore = this.getCommandStore(storeId);
    return commandStore.getState();
  }

  /**
   * Liefert den CommandStore mit der Id @param{storeId}.
   *
   * @template T
   * @param {string} storeId
   * @returns {CommandStore<T>}
   *
   * @memberOf Store
   */
  public getCommandStore<T extends IServiceState>(storeId: string): CommandStore<T> {
    Assert.notNullOrEmpty(storeId);
    return this.commandStores.get(storeId);
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
    const commandStore = this.getCommandStore(storeId);
    return commandStore.subject();
  }


  /**
   * Setzt den Status aller CommandStores auf den initialen Zustand.
   * Erforderlich z.B. bei Logoff/User-Wechsel
   *
   * @memberOf Store
   */
  public reset() {
    this.commandStores.values.forEach((store) => {
      store.reset();
    });
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
      if (this.commandStores.containsKey(store.name)) {
        throw new InvalidOperationException(`Store enthält bereits einen CommandStore ${store.name}`);
      }
      this.commandStores.set(store.name, store);
    });
  }

}