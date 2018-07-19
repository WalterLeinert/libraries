import { MetadataStorage } from '../metadata/metadataStorage';
import { SpecialColumns } from '../metadata/specialColumns';

/**
 * Decorator: definiert die Test-Spalte für Implementierung von speziellen internen Tests
 * TODO: nicht definiert, was damit genau passieren soll
 */
export function Test() {
  // tslint:disable-next-line:only-arrow-functions
  return (target: object, propertyName: string) => {
    MetadataStorage.instance.setSpecialColumn(target.constructor, propertyName, SpecialColumns.TEST);
  };
}