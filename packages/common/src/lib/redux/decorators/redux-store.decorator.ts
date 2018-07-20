import { Funktion } from '@fluxgate/core';

import { CommandStoreMetadata } from './command-store-metadata';
import { CommandStoreStorage } from './command-store-storage';

/**
 * Decorator für Redux-Commandstores
 *
 * @export
 * @returns
 */
export function ReduxStore() {
  // tslint:disable-next-line:only-arrow-functions
  return (target: Funktion) => {
    CommandStoreStorage.instance.addStoreMetadata(new CommandStoreMetadata(target));
  };
}