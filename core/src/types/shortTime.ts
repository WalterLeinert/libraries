import leftPad = require('left-pad');
import { ConverterBase } from '../converter/converter-base';
import { IConverterOptions } from '../converter/converter-options.interface';
import { Converter } from '../converter/converter.decorator';
import { IConverter } from '../converter/converter.interface';
import { Nullable } from '../types/nullable';
import { StringBuilder } from './../base/stringBuilder';
import { Assert } from './../util/assert';
import { Hour } from './hour';
import { MathUtil } from './mathUtil';
import { Types } from './types';


/**
 * Modelliert eine Zeit (HH:mm), da Date keine reine Zeit unterstützt
 *
 * @export
 * @class ShortTime
 */
export class ShortTime {

  /**
   * Erzeugt aus dem String @param{text} eine @see{ShortTime}-Instanz.
   *
   * @static
   * @param {string} text
   * @returns {ShortTime}
   *
   * @memberOf ShortTime
   */
  public static parse(text: string): ShortTime {
    Assert.notNullOrEmpty(text);

    const parts = text.split(':');
    Assert.that(parts.length >= 2);

    if (parts.length > 2) {
      const seconds = +parts[2];
      Assert.that(seconds === 0, `Zeit ${text}: Falls Sekunden angegeben sind, darf der Wert nur 00 sein.`);
    }

    const hour = +parts[0];
    const minute = +parts[1];

    return new ShortTime(hour as Hour, minute);
  }


  /**
   * Erzeugt eine @see{ShortTime}-Instanz aus dem angegebenen Objekt, falls dieses
   * die Properties der @see{ShortTime}-Klasse enthält.
   *
   * @static
   * @param {*} obj
   * @returns
   *
   * @memberOf ShortTime
   */
  public static createFrom(obj: any) {
    // tslint:disable:no-string-literal
    const hour: Hour = obj['hour'];
    const minute: number = obj['minute'];

    const sb = new StringBuilder();
    if (hour === undefined) {
      sb.appendWithDelimiter('hour');
    }
    if (minute === undefined) {
      sb.appendWithDelimiter('minute');
    }
    Assert.that(sb.isEmpty, `Property ${sb} fehlt.`);

    return new ShortTime(hour, minute);
  }

  /**
   * Erzeugt aus der Zeitangabe in Minuten eine @see{ShortTime}-Instanz.
   *
   * @static
   * @param {number} minutes
   * @returns {ShortTime}
   *
   * @memberOf ShortTime
   */
  public static createFromMinutes(minutes: number): ShortTime {
    const hour = Math.floor(minutes / 60);
    const minute = Math.floor(minutes - hour * 60);

    return new ShortTime(hour as Hour, minute);
  }


  /**
   * Creates an instance of ShortTime.
   *
   * @param {Hour} _hour
   * @param {number} _minute
   *
   * @memberOf ShortTime
   */
  public constructor(public hour: Hour, public minute: number) {
    // default constructor?
    if (!(Types.isUndefined(hour) && Types.isUndefined(minute))) {
      Assert.that(!Types.isUndefined(hour) && (hour >= 0 && hour <= 23));
      Assert.that(!Types.isUndefined(minute) && minute >= 0 && minute <= 59);
    }
  }


  /**
   * Liefert die String-Repräsentation.
   *
   * @returns {string}
   *
   * @memberOf ShortTime
   */
  public toString(): string {
    return `${leftPad(this.hour, 2, 0)}:${leftPad(this.minute, 2, 0)}`;
  }


  public toMinutes(): number {
    return this.hour * 60 + this.minute;
  }


  /**
   * Liefert die Zeit in Stunden als Dezimalzahl. Ist @param{decimalPlaces} angegeben,
   * dann werden nur die entsprechende Anzahl von Nachkommastellen berücksichtigt.
   *
   * @param {number} [decimalPlaces]
   * @returns
   *
   * @memberOf ShortTime
   */
  public toHours(decimalPlaces?: number) {
    Assert.that(Types.isUndefined(decimalPlaces) || decimalPlaces >= 0);

    if (!decimalPlaces) {
      return this.toMinutes() / 60;
    } else {
      return MathUtil.round10(this.toMinutes() / 60, -decimalPlaces);
    }
  }


  /**
   * Addiert zur Zeit der aktuellen Instanz die Zeit @param{time} und liefert
   * das Ergebnis.
   *
   * @param {ShortTime} time
   * @returns {ShortTime}
   *
   * @memberOf ShortTime
   */
  public add(time: ShortTime): ShortTime {
    const timeInMinutes = this.toMinutes() + time.toMinutes();
    return ShortTime.createFromMinutes(timeInMinutes);
  }

  /**
   * Subrahiert von der Zeit der aktuellen Instanz die Zeit @param{time} und liefert
   * das Ergebnis.
   *
   * @param {ShortTime} time
   * @returns {ShortTime}
   *
   * @memberOf ShortTime
   */
  public subtract(time: ShortTime): ShortTime {
    Assert.notNull(time);
    Assert.that(Types.isFunction(this.toMinutes));
    Assert.that(Types.isFunction(time.toMinutes));

    const timeInMinutes = this.toMinutes() - time.toMinutes();
    Assert.that(timeInMinutes >= 0);
    return ShortTime.createFromMinutes(timeInMinutes);
  }
}

// tslint:disable-next-line:max-classes-per-file
@Converter(ShortTime)
export class ShortTimeConverter extends ConverterBase implements IConverter<ShortTime, String> {

  constructor() {
    super(ShortTime);
  }


  public convert(value: ShortTime, options?: IConverterOptions): Nullable<string> {
    if (!Types.isPresent(value)) {
      return value as any as string;
    }

    return this.doConvert(value, () => value.toString());
  }


  public convertBack(value: string, options?: IConverterOptions): Nullable<ShortTime> {
    if (!Types.isPresent(value)) {
      return value as any as ShortTime;
    }

    return this.doConvertBack(value, () => ShortTime.parse(value));
  }

}