import { MetadataStorage } from '../metadata/metadataStorage';
import { SpecialColumns } from '../metadata/specialColumns';
import { registerColumn } from './column';
import { ColumnOptions } from './columnOptions';

/**
 * Decorator: definiert die Property der Client-Id (Mandantenfähigkeit)
 */
export function ClientColumn(options?: ColumnOptions) {
  // tslint:disable-next-line:only-arrow-functions
  return function (target: Object, propertyName: string) {
    registerColumn(target, propertyName, options);
    MetadataStorage.instance.setSpecialColumn(target.constructor, propertyName, SpecialColumns.CLIENT);
  };
}