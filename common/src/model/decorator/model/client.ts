import { MetadataStorage } from '../../metadata/metadataStorage';


/**
 * Definiert die Version-Spalte für Implementierung von Mandantenfähigkeit
 */
export function Client() {
  // tslint:disable-next-line:only-arrow-functions
  return function(target: any, propertyName: string) {
    MetadataStorage.instance.setClient(target.constructor, propertyName);
  };
}