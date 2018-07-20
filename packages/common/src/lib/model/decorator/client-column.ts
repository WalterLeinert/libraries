import { MetadataStorage } from '../metadata/metadataStorage';
import { SpecialColumns } from '../metadata/specialColumns';
import { registerColumn } from './column';
import { ColumnOptions } from './columnOptions';

/**
 * Decorator: definiert die Property der Client-Id (Mandantenfähigkeit)
 */
export function ClientColumn(options?: ColumnOptions) {
  // tslint:disable-next-line:only-arrow-functions
  return function(target: object, propertyName: string) {
    let columnOptions = options;

    //
    // defaults, falls keine Options angegeben
    //
    if (columnOptions === undefined) {
      columnOptions = {
        hidden: true
      };
    } else {
      // sonst, defaults setzen
      columnOptions = {
        ...options,
        hidden: options.hidden === undefined ? true : options.hidden              // default: true
      };
    }

    registerColumn(target, propertyName, columnOptions);
    MetadataStorage.instance.setSpecialColumn(target.constructor, propertyName, SpecialColumns.CLIENT);
  };
}