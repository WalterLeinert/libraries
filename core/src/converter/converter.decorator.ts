// tslint:disable-next-line:no-var-requires
require('reflect-metadata');

import { ICtor } from '../base/ctor';
import { Funktion } from '../base/objectType';
import { ConverterRegistry } from './converter-registry';
import { IConverter } from './converter.interface';

/**
 * Definiert die Konvertierung von Klasseninstanzen.
 *
 * @export
 * @template T1 Typ 1
 * @template T2 Typ 2
 * @param {Funktion} type - der (Klassen-)Typ, für den der Converter arbeiten soll
 * @returns
 */
export function Converter<T1, T2>(type: Funktion) {
  // tslint:disable-next-line:only-arrow-functions
  return function (converterType: ICtor<IConverter<T1, T2>>) {
    ConverterRegistry.register(type, new converterType());
  };
}