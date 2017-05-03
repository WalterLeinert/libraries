import { Assert, Funktion } from '@fluxgate/core';

import { MetadataStorage } from '../../metadata/metadataStorage';
import { TableMetadataInternal } from '../../metadata/tableMetadataInternal';

/**
 * TableService-Decorator für Modellklassen
 *
 * Mit dem Decorator wird für eine Serviceklasse definiert, auf welcher Modelklasse sie arbeitet.
 *
 * @export
 * @param {Funktion} modelClazz - die Modelklasse, auf der der Service arbeiten soll
 * @returns
 */
export function TableService(modelClazz: Funktion) {
  // tslint:disable-next-line:only-arrow-functions
  return function (target: Funktion) {
    Assert.notNull(modelClazz);

    const tableMetadata = MetadataStorage.instance.findTableMetadata(modelClazz) as TableMetadataInternal;
    Assert.notNull(tableMetadata, `Modelclass ${modelClazz.name} not found. No @Table decorator?`);
    tableMetadata.registerServiceClazz(target);
  };
}