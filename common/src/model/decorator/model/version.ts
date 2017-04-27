import { MetadataStorage } from '../../metadata/metadataStorage';
import { SpecialColumns } from '../../metadata/specialColumns';

/**
 * Decorator: definiert die Modelproperty für Implementierung von optimistic locking detection.
 * Bei jeder DB-Update Operation wird die Version erhöht. Versuchen 2 Benutzer Änderungen an denselben
 * Daten zu speicher, gewinnt der erste und der 2. User bekommt eine "OptimisticLockException"
 */
export function Version() {
  // tslint:disable-next-line:only-arrow-functions
  return function (target: any, propertyName: string) {
    MetadataStorage.instance.setSpecialColumn(target.constructor, propertyName, SpecialColumns.VERSION);
  };
}