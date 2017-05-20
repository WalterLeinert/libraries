import { MetadataStorage } from '../../metadata/metadataStorage';
import { SpecialColumns } from '../../metadata/specialColumns';
import { registerColumn } from './column';
import { ColumnOptions } from './columnOptions';

/**
 * Decorator: definiert die Property des Mandanten (Mandantenfähigkeit)
 */
export function ClientColumn(options?: ColumnOptions) {
  // tslint:disable-next-line:only-arrow-functions
  return function (target: any, propertyName: string) {
    registerColumn(target, propertyName, options);
    MetadataStorage.instance.setSpecialColumn(target, propertyName, SpecialColumns.CLIENT);
  };
}