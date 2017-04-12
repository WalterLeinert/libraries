import { MetadataStorage } from '../../metadata/metadataStorage';
import { SpecialColumns } from '../../metadata/specialColumns';

/**
 * Definiert die Test-Spalte für Implementierung von speziellen internen Tests
 */
export function Test() {
  // tslint:disable-next-line:only-arrow-functions
  return function (target: any, propertyName: string) {
    MetadataStorage.instance.setSpecialColumn(target.constructor, propertyName, SpecialColumns.TEST);
  };
}