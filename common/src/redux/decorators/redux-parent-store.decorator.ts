import { Funktion } from '@fluxgate/core';

import { RelationTypeInFunction } from '../../model/metadata/enumMetadata';
import { CommandStoreMetadata } from './command-store-metadata';
import { CommandStoreStorage } from './command-store-storage';

/**
 * Decorator für Redux-Commandstores
 *
 * @export
 * @template T
 * @param {(type?: T) => ICtor<T>} parentStore - die Klasse des Parentstores
 * @returns
 */
export function ReduxParentStore<T>(parentStore: RelationTypeInFunction) {
  // tslint:disable-next-line:only-arrow-functions
  return function (target: Funktion) {
    CommandStoreStorage.instance.addStoreMetadata(new CommandStoreMetadata(target, parentStore));
  };
}