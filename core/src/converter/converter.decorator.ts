// tslint:disable-next-line:no-var-requires
require('reflect-metadata');

import { Assert } from '../util/assert';
import { Utility } from '../util/utility';
import { ConverterKey } from './converter-key';
import { ConverterRegistry, IConverterTuple } from './converter-registry';
import { ClassConverterMetadata } from './metadata/class-converter-metadata';
import { ConverterMetadataStorage } from './metadata/converter-metadata-storage';
import { PropertyConverterMetadata } from './metadata/property-converter-metadata';


/**
 * Definiert die Konvertierung von Klassen oder Properties.
 *
 * @export
 * @template TFrom Quelltype
 * @template TTo Zieltyp
 * @param {ConverterKey} key - Key, für den Zugriff auf das entsprechende Converter-Tuple
 * @param {IConverterTuple<TFrom, TTo>} [converterTuple] - Convertertuple mit from- und to-Converter
 * @returns
 */
export function Converter<TFrom, TTo>(key: ConverterKey, converterTuple?: IConverterTuple<TFrom, TTo>) {
  // tslint:disable-next-line:only-arrow-functions
  return function (target: any, propertyName?: string, descriptor?: PropertyDescriptor) {

    if (Utility.isNullOrEmpty(propertyName)) {
      Assert.notNull(converterTuple);

      ConverterRegistry.register(key, converterTuple);

      ConverterMetadataStorage.instance.addClassConverterMetadata(new ClassConverterMetadata(target, key));
    } else {

      let propertyType: any = (Reflect as any).getMetadata('design:type', target, propertyName);

      ConverterMetadataStorage.instance.addPropertyConverterMetadata(
        new PropertyConverterMetadata(target, propertyName, propertyType, key));
    }
  };
}