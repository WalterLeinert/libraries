import { InvalidOperationException } from '../exceptions/invalidOperationException';
import { NotSupportedException } from '../exceptions/notSupportedException';
import { Dictionary } from '../types/dictionary';
import { BOOLEAN_CONVERTER, BooleanFromStringConverter, StringFromBooleanConverter } from './boolean-converter';
import { ConverterKey } from './converter-key';
import { IConverter } from './converter.interface';
import { DATE_CONVERTER, DateFromStringConverter, StringFromDateConverter } from './date-converter';
import { ERROR_CONVERTER, ErrorFromStringConverter, StringFromErrorConverter } from './error-converter';
import { NUMBER_CONVERTER, NumberFromStringConverter, StringFromNumberConverter } from './number-converter';


/**
 * Interface für ein Tuple von Convertern:
 *
 * @export
 * @interface IConverterTuple
 * @template TFrom
 * @template TTo
 */
export interface IConverterTuple<TFrom, TTo> {
  /**
   * Converter, der eine Instanz von Typ @type{TFrom} in eine Instanz vom Type @type{TTo} wandelt.
   *
   * @type {IConverter<TFrom, TTo>}
   * @memberof IConverterTuple
   */
  from: IConverter<TFrom, TTo>;

  /**
   * Converter, der eine Instanz von Typ @type{TTo} in eine Instanz vom Type @type{TFrom} wandelt.
   *
   * @type {IConverter<TFrom, TTo>}
   * @memberof IConverterTuple
   */
  to: IConverter<TTo, TFrom>;
}


export class ConverterRegistry {
  private static converterDict: Dictionary<ConverterKey, IConverterTuple<any, any>> =
  new Dictionary<ConverterKey, IConverterTuple<any, any>>();

  // tslint:disable-next-line:no-unused-variable
  private static initialized = (() => {

    ConverterRegistry.register(DATE_CONVERTER, {
      from: new DateFromStringConverter(),
      to: new StringFromDateConverter()
    });

    ConverterRegistry.register(NUMBER_CONVERTER, {
      from: new NumberFromStringConverter(),
      to: new StringFromNumberConverter()
    });

    ConverterRegistry.register(BOOLEAN_CONVERTER, {
      from: new BooleanFromStringConverter(),
      to: new StringFromBooleanConverter()
    });

    ConverterRegistry.register(ERROR_CONVERTER, {
      from: new ErrorFromStringConverter(),
      to: new StringFromErrorConverter()
    });
  })();


  public static register<TFrom, TTo>(key: ConverterKey, converterTuple: IConverterTuple<TFrom, TTo>) {
    if (ConverterRegistry.converterDict.containsKey(key)) {
      throw new InvalidOperationException(`Converters already registered for key: ${key}`);
    }
    ConverterRegistry.converterDict.set(key, converterTuple);
  }

  /**
   * Liefert eine @see{IConverterTuple}-Instanz für die Konvertierung zwischen Typ @type{TFrom} und @type{TTo}.
   *
   * @static
   * @template TFrom
   * @template TTo
   * @param {Tuple<string, string>} key
   * @returns {IConverterTuple<TFrom, TTo>}
   *
   * @memberof ConverterRegistry
   */
  public static get<TFrom, TTo>(key: ConverterKey): IConverterTuple<TFrom, TTo> {
    if (!ConverterRegistry.converterDict.containsKey(key)) {
      throw new NotSupportedException(`Converter between types ${key.toString()} not supported.`);
    }
    return ConverterRegistry.converterDict.get(key) as IConverterTuple<TFrom, TTo>;
  }

  public static contains<TFrom, TTo>(key: ConverterKey): boolean {
    return ConverterRegistry.converterDict.containsKey(key);
  }
}