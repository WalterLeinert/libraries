import { Funktion } from '@fluxgate/core';

import { MetadataStorage } from '../../metadata/metadataStorage';
import { TableMetadata } from '../../metadata/tableMetadata';

import { TableOptions } from './tableOptions.interface';

/**
 * Table-Decorator für Modellklassen
 *
 * @export
 * @param {TableOptions} [options]
 * @returns
 */
export function Table(options?: TableOptions) {
  // tslint:disable-next-line:only-arrow-functions
  return function (target: Funktion) {
    if (!options) {
      options = {} as TableOptions;
    }

    if (!options.name) {
      options.name = target.name.toLowerCase();
    }
    if (options.isView === undefined) {
      options.isView = false;
    }

    MetadataStorage.instance.addTableMetadata(new TableMetadata(target, options));
  };
}