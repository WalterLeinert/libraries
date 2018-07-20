// -------------------------- logging -------------------------------
// tslint:disable-next-line:no-unused-variable
import { getLogger, ILogger, levels, using, XLog } from '@fluxgate/platform';
// -------------------------- logging -------------------------------

import { Assert, Dictionary, Funktion, Types } from '@fluxgate/core';

import { CommandStore } from '../store/command-store';
import { Store } from '../store/store';
import { CommandStoreMetadata } from './command-store-metadata';


export class CommandStoreStorage {
  protected static readonly logger = getLogger(CommandStoreStorage);

  private static _instance = new CommandStoreStorage();

  private metadataDict: Dictionary<string, CommandStoreMetadata> = new Dictionary<string, CommandStoreMetadata>();

  public addStoreMetadata(metadata: CommandStoreMetadata) {
    using(new XLog(CommandStoreStorage.logger, levels.INFO, 'addStoreMetadata', `targetName = ${metadata.target.name}`),
      (log) => {
        const targetName = metadata.target.name;
        this.metadataDict.set(targetName, metadata);
      });
  }

  public removeStoreMetadata(target: Funktion | string): void {
    Assert.notNull(target);
    if (Types.isString(target)) {
      Assert.that(this.metadataDict.containsKey(target as string));
      this.metadataDict.remove(target as string);
    } else {
      Assert.that(Types.isFunction(target));
      Assert.that(this.metadataDict.containsKey((target as Funktion).name));
      this.metadataDict.remove((target as Funktion).name);
    }
  }


  /**
   * Registriert neue CommandStore-Instanzen beim @param{store}, für die Metadaten vorliegen.
   *
   * @param {Store} store
   *
   * @memberOf CommandStoreStorage
   */
  public registerStores(store: Store) {
    const storeDict: Dictionary<string, CommandStore<any>> = new Dictionary<string, CommandStore<any>>();

    // zunächst alle Root-CommandStores erzeugen und registrieren, damit diese dann im folgenden Pass
    // vorhanden sind
    this.metadataDict.values
      .filter((item) => !Types.isPresent(item.parent))
      .forEach((meta) => {
        storeDict.set(meta.target.name, meta.createStore<any>());
      });

    // dann alle CommandStores mit Parents erzeugen und registrieren
    this.metadataDict.values
      .filter((item) => Types.isPresent(item.parent))
      .forEach((meta) => {
        const parent = storeDict.get(meta.parent.name);
        const child = meta.createStore<any>(parent);
        storeDict.set(meta.target.name, child);

        parent.addChild(child);
      });

    // schliesslich alle CommandStores beim store registrieren
    storeDict.values
      .forEach((item) => {
        store.add(item);
      });
  }



  /**
   * Liefert die Singleton-Instanz.
   *
   * @readonly
   * @static
   * @type {CommandStoreMetadata}
   * @memberOf CommandStoreStorage
   */
  public static get instance(): CommandStoreStorage {
    return CommandStoreStorage._instance;
  }

}