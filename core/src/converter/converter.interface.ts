import { Nullable } from '../types/nullable';
import { IConverterOptions } from './converter-options.interface';

/**
 * Interface für Converter, die eine Instanz des Typs T1 in eine Instanz des Typs T2 und umgekehrt wandeln.
 *
 * Optional können Konvertierungsoptionen angegeben werden.
 *
 * @export
 * @interface IConverter
 * @template TSource
 * @template TDest
 */
export interface IConverter<T1, T2> {

  /**
   * Konvertiert eine Instanz vom Typ @see{T1} in eine Instanz vom Typ @see{T2}
   *
   * @param {T1} value - zu wandelndes Quellobjekt
   * @param {IConverterOptions} [options] - Konvertierungsoptionen
   * @returns {T2} - Instanz vom Zieltyp.
   *
   * @memberof IValueConverter
   */
  convert(value: T1, options?: IConverterOptions): Nullable<T2>;


  /**
   * Konvertiert eine Instanz vom Typ @see{T2} in eine Instanz vom Typ @see{T2}
   *
   * @param {T2} value - zu wandelndes Quellobjekt
   * @param {IConverterOptions} [options] - Konvertierungsoptionen
   * @returns {T1} - Instanz vom Zieltyp.
   *
   * @memberof IValueConverter
   */
  convertBack(value: T2, options?: IConverterOptions): Nullable<T1>;
}