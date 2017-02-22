// Logging
import { getLogger } from '../../../diagnostics/logger';

import { EnumTableMetadata } from '../../metadata/enumTableMetadata';
import { MetadataStorage } from '../../metadata/metadataStorage';
import { TableMetadata } from '../../metadata/tableMetadata';
import { EnumTableOptions } from './enumTableOptions';
import { IEnumTableOptions } from './enumTableOptions.interface';

const logger = getLogger('Column');

/**
 * Table-Decorator für Modellklassen
 * 
 * @export
 * @param {TableOptions} [options]
 * @returns
 */
export function EnumTable(options: IEnumTableOptions) {
  // tslint:disable-next-line:only-arrow-functions
  return function(target: Function) {
  
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