import { ClassSerializerMetadata, Funktion, SerializerMetadataStorage } from '@fluxgate/core';

import { MetadataStorage } from '../metadata/metadataStorage';
import { TableMetadataInternal } from '../metadata/tableMetadataInternal';

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
  return (target: Funktion) => {
    if (!options) {
      options = {} as TableOptions;
    }

    if (!options.name) {
      options.name = target.name.toLowerCase();
    }
    if (options.isView === undefined) {
      options.isView = false;
    }
    if (options.isAbstract === undefined) {
      options.isAbstract = false;
    }

    MetadataStorage.instance.addTableMetadata(new TableMetadataInternal(MetadataStorage.instance, target, options));

    //
    // alle Modelklassen sind serialisierbar
    //
    SerializerMetadataStorage.instance.addClassMetadata(new ClassSerializerMetadata(target));
  };
}