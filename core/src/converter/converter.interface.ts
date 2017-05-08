import { Nullable } from '../types/nullable';
import { IConverterOptions } from './converter-options.interface';

/**
 * Interface für Converter, die eine Instanz des Typs TFrom in eine Instant des Typs TTo wandeln.
 *
 * Optional können Konvertierungsoptionen angegeben werden.
 *
 * @export
 * @interface IConverter
 * @template TFrom
 * @template TTo
 */
export interface IConverter<TFrom, TTo> {

  /**
   *
   *
   * @param {TFrom} value - zu wandelndes Quellobjekt
   * @param {IConverterOptions} [options] - Konvertierungsoptionen
   * @returns {TTo} - Instanz vom Zieltyp.
   *
   * @memberof IConverter
   */
  convert(value: TFrom, options?: IConverterOptions): Nullable<TTo>;
}