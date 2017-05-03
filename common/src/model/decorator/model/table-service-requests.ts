import { Assert, Funktion } from '@fluxgate/core';

import { MetadataStorage } from '../../metadata/metadataStorage';
import { TableMetadataInternal } from '../../metadata/tableMetadataInternal';

/**
 * TableServiceRequests-Decorator für Modellklassen
 *
 * Mit dem Decorator wird für eine ServiceRequests-Klasse definiert, auf welcher Modelklasse sie arbeitet.
 *
 * @export
 * @param {Funktion} modelClazz - die Modelklasse, auf der ServiceRequests arbeiten sollen
 * @returns
 */
export function TableServiceRequests(modelClazz: Funktion) {
  // tslint:disable-next-line:only-arrow-functions
  return function (target: Funktion) {
    Assert.notNull(modelClazz);

    const tableMetadata = MetadataStorage.instance.findTableMetadata(modelClazz) as TableMetadataInternal;
    Assert.notNull(tableMetadata, `Modelclass ${modelClazz.name} not found. @Table decorator missing?`);
    tableMetadata.registerServiceRequestsClazz(target);
  };
}