import { Funktion } from '@fluxgate/common';

import { CommandStoreMetadata } from './command-store-metadata';
import { CommandStoreStorage } from './command-store-storage';

/**
 * Table-Decorator für Redux-Commandstores
 *
 * @export
 * @returns
 */
export function ReduxStore() {
  // tslint:disable-next-line:only-arrow-functions
  return function(target: Funktion) {
    CommandStoreStorage.instance.addStoreMetadata(new CommandStoreMetadata(target));
  };
}