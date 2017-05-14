import { Funktion } from '../base/objectType';
import { InvalidOperationException } from '../exceptions/invalidOperationException';
import { Dictionary } from '../types/dictionary';
import { Assert } from '../util/assert';
import { IConverter } from './converter.interface';
import { DateConverter } from './date-converter';
import { ErrorConverter } from './error-converter';
import { NumberConverter } from './number-converter';

/**
 * Registry für alle bekannten Converter.
 *
 * @export
 * @class ConverterRegistry
 */
export class ConverterRegistry {
  private static converterDict: Dictionary<string, IConverter<any, any>> =
  new Dictionary<string, IConverter<any, any>>();


  // tslint:disable-next-line:no-unused-variable
  private static initialized = (() => {
    ConverterRegistry.register(Date, new DateConverter());
    ConverterRegistry.register(Error, new ErrorConverter());
    // ConverterRegistry.register('number', new NumberConverter());
    ConverterRegistry.register(Number, new NumberConverter());
  })();

  public static register<T1, T2>(type: string | Funktion, converter: IConverter<T1, T2>) {
    Assert.notNull(type);

    let typeName;
    if (typeof type === 'string') {
      typeName = type;
    } else {
      typeName = type.name;
    }

    if (ConverterRegistry.converterDict.containsKey(typeName)) {
      throw new InvalidOperationException(`Converters already registered for type: ${typeName}`);
    }
    ConverterRegistry.converterDict.set(typeName, converter);
  }



  /**
   * Liefert eine @see{IConverter}-Instanz für die Konvertierung zwischen Typ @type{T1} und @type{T2}
   * oder undefined.
   *
   * @static
   * @template T1
   * @template T2
   * @param {string|Funktion} type
   * @returns {IConverter<T1, T2>}
   *
   * @memberof ConverterRegistry
   */
  public static get<T1, T2>(type: string | Funktion): IConverter<T1, T2> {
    Assert.notNull(type);

    let typeName;
    if (typeof type === 'string') {
      typeName = type;
    } else {
      typeName = type.name;
    }

    if (!ConverterRegistry.converterDict.containsKey(typeName)) {
      return undefined;
    }
    return ConverterRegistry.converterDict.get(typeName);
  }
}