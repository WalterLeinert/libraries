import { registerColumn } from './column';
import { ColumnOptions } from './columnOptions';
import { IdColumnOptions } from './idColumnOptions';


/**
 * Decorator: definiert die primary key Property der Entity
 */
export function IdColumn(options?: IdColumnOptions) {
  // tslint:disable-next-line:only-arrow-functions
  return function (target: any, propertyName: string) {
    let columnOptions = options as ColumnOptions;

    //
    // defaults, falls keine Options angegeben
    //
    columnOptions = {
      ...columnOptions,
      primary: true,
      generated: true
    };


    registerColumn(target, propertyName, columnOptions);

    // erfolgt in TableMetadata.add(...)
    // MetadataStorage.instance.setSpecialColumn(target, propertyName, SpecialColumns.PRIMARY_KEY);
  };
}