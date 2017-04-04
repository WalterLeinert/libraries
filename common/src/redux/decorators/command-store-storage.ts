// -------------------------------------- logging --------------------------------------------
// Logging
import { using } from '../../base/disposable';
import { levels } from '../../diagnostics/level';
import { getLogger } from '../../diagnostics/logger';
// tslint:disable-next-line:no-unused-variable
import { ILogger } from '../../diagnostics/logger.interface';
import { XLog } from '../../diagnostics/xlog';
// -------------------------------------- logging --------------------------------------------


import { Funktion } from '../../base/objectType';
import { Dictionary } from '../../types/dictionary';
import { Types } from '../../types/types';
import { Assert } from '../../util/assert';

import { Store } from '../store';
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

  public findTableMetadata(target: Funktion | string): CommandStoreMetadata {
    Assert.notNull(target);
    if (Types.isString(target)) {
      return this.metadataDict.get(target as string);
    }
    Assert.that(Types.isFunction(target));

    return this.metadataDict.get((target as Funktion).name);
  }

  /**
   * Registriert neue CommandStore-Instanzen beim @param{store}, für die Metadaten vorliegen.
   *
   * @param {Store} store
   *
   * @memberOf CommandStoreStorage
   */
  public registerStores(store: Store) {
    this.metadataDict.values.forEach((metadata) => {
      store.add(metadata.createStore<any>());
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