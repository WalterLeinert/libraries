import { Core } from '../../src/diagnostics/core';
import { InvalidOperationException } from '../../src/exceptions/invalidOperationException';
import { Funktion } from './../base/objectType';
import { Assert } from './../util/assert';
import { IConverter } from './converter.interface';

/**
 * Basisklasse für alle Converter
 *
 * @export
 * @abstract
 * @class ConverterBase
 */
export abstract class ConverterBase<T1, T2> {

  constructor(private type: Funktion) {
    Assert.notNull(type);
  }


  /**
   * Führt die Konvertierung eines Werts vom Typ T1 in einen Wert von Typ T2 durch und
   * und überprüft verschiedene Fehlersituationen
   *
   * @protected
   * @param {T1} value - Wert vom Typ T1
   * @param {Function} type1 - Klasse des Typs T1
   * @param {(value: T1) => T2} convert - eigentliche Konvertierung
   * @returns {T2}
   *
   * @memberof ConverterBase
   */
  protected doConvert(value: T1, convert: (value: T1) => T2): T2 {

    let rval;
    try {
      Assert.notNull(value);

      if (!(value.constructor && (value.constructor === this.type))) {
        throw new Error(`invalid type ${this.type.name}: ${Core.stringify(value)}`);
      }

      rval = convert(value);

    } catch (exc) {
      throw new InvalidOperationException(`convert: no valid ${this.type.name}: '${value}'`, exc);
    }

    return rval;
  }


  /**
   * Führt die (Rück-)Konvertierung eines Werts vom Typ T2 in einen Wert von Typ T1 durch und
   * und überprüft verschiedene Fehlersituationen
   *
   * @protected
   * @template T1
   * @template T2
   * @param {T2} value - Wert vom Typ T2
   * @param {Function} type2 - Klasse des Typs T2
   * @param {(value: T2) => T1} convertBack - eigentliche Konvertierung
   * @returns {T1}
   *
   * @memberof ConverterBase
   */
  protected doConvertBack(value: T2, convertBack: (value: T2) => T1): T1 {

    let rval;
    try {
      Assert.notNull(value);

      if (typeof value === 'string') {
        Assert.notNullOrEmpty(value);
      }

      rval = convertBack(value);

    } catch (exc) {
      throw new InvalidOperationException(`convertBack: no valid ${this.type.name}: '${value}'`, exc);
    }

    return rval;
  }
}