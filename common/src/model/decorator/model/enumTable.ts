import { Funktion } from '@fluxgate/core';
import { getLogger } from '@fluxgate/platform';

import { EnumTableMetadata } from '../../metadata/enumTableMetadata';
import { MetadataStorage } from '../../metadata/metadataStorage';
import { EnumTableOptions } from './enumTableOptions';
import { IEnumTableOptions } from './enumTableOptions.interface';

const logger = getLogger(EnumTable);

/**
 * Decorator: definiert eine Modellklasse, die eine DB-Tabelle simuliert und eine Werteliste für Enums direkt
 * bereit stellt.
 *
 * @export
 * @param {TableOptions} [options]
 * @returns
 */
export function EnumTable(options: IEnumTableOptions) {
  // tslint:disable-next-line:only-arrow-functions
  return function (target: Funktion) {

    if (!options.name) {
      options.name = target.name.toLowerCase();
    }
    if (options.isView !== undefined && options.isView === false) {
      logger.warn(`${target.name}: must be view`);
    }
    options.isView = true;

    const tableOptions = new EnumTableOptions();
    tableOptions.name = options.name;
    tableOptions.isView = options.isView;
    tableOptions.enumValues = options.enumValues;

    MetadataStorage.instance.addTableMetadata(new EnumTableMetadata(target, tableOptions));
  };
}