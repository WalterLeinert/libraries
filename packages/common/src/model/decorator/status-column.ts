import { EntityStatus } from '../entity-status';
import { MetadataStorage } from '../metadata/metadataStorage';
import { registerColumn } from './column';
import { ColumnOptions } from './columnOptions';

/**
 * Decorator: definiert die Property für einen Entity-Status
 */
export function StatusColumn(status: EntityStatus, options?: ColumnOptions) {
  // tslint:disable-next-line:only-arrow-functions
  return function(target: object, propertyName: string) {
    let columnOptions = options;

    //
    // defaults, falls keine Options angegeben
    //
    if (columnOptions === undefined) {
      columnOptions = {
        hidden: true,
        persisted: false
      };
    } else {
      // sonst, defaults setzen
      columnOptions = {
        ...options,
        hidden: options.hidden === undefined ? true : options.hidden,               // default: true
        persisted: options.persisted === undefined ? false : options.persisted      // default: false
      };
    }

    registerColumn(target, propertyName, columnOptions);
    MetadataStorage.instance.setStatusColumn(target.constructor, propertyName, status);
  };
}