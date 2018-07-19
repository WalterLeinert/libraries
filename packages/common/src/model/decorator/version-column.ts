import { MetadataStorage } from '../metadata/metadataStorage';
import { SpecialColumns } from '../metadata/specialColumns';
import { registerColumn } from './column';
import { ColumnOptions } from './columnOptions';

/**
 * Decorator: definiert die Property für die Versionierung der Entity (optimistic lock strategy)
 */
export function VersionColumn(options?: ColumnOptions) {
  // tslint:disable-next-line:only-arrow-functions
  return function(target: object, propertyName: string) {
    let columnOptions = options;

    //
    // defaults, falls keine Options angegeben
    //
    if (columnOptions === undefined) {
      columnOptions = {
        generated: true,
        hidden: true
      };
    } else {
      // sonst, defaults setzen
      columnOptions = {
        ...options,
        generated: options.generated === undefined ? true : options.generated,    // default: true,
        hidden: options.hidden === undefined ? true : options.hidden              // default: true
      };
    }

    registerColumn(target, propertyName, columnOptions);
    MetadataStorage.instance.setSpecialColumn(target.constructor, propertyName, SpecialColumns.VERSION);
  };
}