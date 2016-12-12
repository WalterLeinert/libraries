import { TableOptions } from './tableOptions';
import { MetadataStorage } from '../metadata/metadataStorage';
import { TableMetadata } from '../metadata/tableMetadata';


/**
 * Table-Decorator für Modellklassen
 * 
 * @export
 * @param {TableOptions} [options]
 * @returns
 */
export function Table(options?: TableOptions) {
  return function (target: Function) {
    if (!options) {
      options = {} as TableOptions;
    }

    if (!options.name) {
      options.name = target.name.toLowerCase();
    }
    if (options.isView) {
      options.isView = false;
    }

    MetadataStorage.instance.addTableMetadata(new TableMetadata(target, options));
  }
}