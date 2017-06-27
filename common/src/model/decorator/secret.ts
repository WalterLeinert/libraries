import { MetadataStorage } from '../metadata/metadataStorage';
import { SpecialColumns } from '../metadata/specialColumns';

/**
 * Decorator: definiert die enstprechende Spalte als eine Spalte,
 * die Informationen enthält (wie Passwort), die z.B. in Logfiles nicht
 * oder nicht im Klartext ausgegeben werden dürfen.
 */
export function Secret() {
  // tslint:disable-next-line:only-arrow-functions
  return function(target: object, propertyName: string) {
    MetadataStorage.instance.setSpecialColumn(target.constructor, propertyName, SpecialColumns.SECRET);
  };
}