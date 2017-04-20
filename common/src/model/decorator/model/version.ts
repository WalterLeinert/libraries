import { MetadataStorage } from '../../metadata/metadataStorage';
import { SpecialColumns } from '../../metadata/specialColumns';

/**
 * Definiert die Version-Spalte für Implementierung von optimistic locking
 */
export function Version() {
  // tslint:disable-next-line:only-arrow-functions
  return function (target: any, propertyName: string) {
    MetadataStorage.instance.setSpecialColumn(target.constructor, propertyName, SpecialColumns.VERSION);
  };
}