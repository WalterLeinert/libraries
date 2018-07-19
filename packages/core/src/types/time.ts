import leftPad = require('left-pad');
import { ConverterBase } from '../converter/converter-base';
import { IConverterOptions } from '../converter/converter-options.interface';
import { Converter } from '../converter/converter.decorator';
import { IConverter } from '../converter/converter.interface';
import { Nullable } from '../types/nullable';
import { StringBuilder } from './../base/stringBuilder';
import { Assert } from './../util/assert';
import { Hour } from './hour';
import { ShortTime } from './shortTime';
import { Types } from './types';

/**
 * Modelliert eine Zeit (HH:mm:ss), da Date keine reine Zeit unterstützt
 *
 * @export
 * @class Time
 */
export class Time extends ShortTime {

  /**
   * Erzeugt aus dem String @param{text} eine @see{Time}-Instanz.
   *
   * @static
   * @param {string} text
   * @returns {Time}
   *
   * @memberOf Time
   */
  public static parse(text: string): Time {
    Assert.notNullOrEmpty(text);

    const parts = text.split(':');
    Assert.that(parts.length === 3);

    const hour = +parts[0];
    const minute = +parts[1];
    const second = +parts[2];

    Assert.that(hour >= 0 && hour < 24);

    return new Time(hour as Hour, minute, second);
  }


  /**
   * Erzeugt eine @see{Time}-Instanz aus dem angegebenen Objekt, falls dieses
   * die Properties der @see{Time}-Klasse enthält.
   *
   * @static
   * @param {*} obj
   * @returns
   *
   * @memberOf Time
   */
  public static createFrom(obj: any) {
    // tslint:disable:no-string-literal
    const hour: Hour = obj['hour'];
    const minute: number = obj['minute'];
    const second: number = obj['second'];

    const sb = new StringBuilder();
    if (hour === undefined) {
      sb.appendWithDelimiter('hour');
    }
    if (minute === undefined) {
      sb.appendWithDelimiter('minute');
    }
    if (second === undefined) {
      sb.appendWithDelimiter('second');
    }
    Assert.that(sb.isEmpty, `Property ${sb} fehlt.`);

    return new Time(hour, minute, second);
  }

  /**
   * Erzeugt aus der Zeitangabe in Sekunden eine @see{Time}-Instanz.
   *
   * @static
   * @param {number} seconds
   * @returns {Time}
   *
   * @memberOf Time
   */
  public static createFromSeconds(seconds: number): Time {
    const hour = Math.floor(seconds / 3600);
    const minute = Math.floor((seconds - hour * 3600) / 60);
    const second = (seconds - hour * 3600 - minute * 60);

    return new Time(hour as Hour, minute, second);
  }


  /**
   * Creates an instance of Time.
   *
   * @param {Hour} _hour
   * @param {number} _minute
   * @param {number} _second
   *
   * @memberOf Time
   */
  public constructor(hour: Hour, minute: number, public second: number) {
    super(hour, minute);

    // default constructor?
    if (!Types.isUndefined(second)) {
      Assert.that(!Types.isUndefined(second) && (second >= 0 && second <= 59));
    }
  }

  /**
   * Liefert die String-Repräsentation.
   *
   * @returns {string}
   *
   * @memberOf Time
   */
  public toString(): string {
    return `${super.toString()}:${leftPad(this.second, 2, 0)}`;
  }

  public toSeconds(): number {
    return this.hour * 3600 + this.minute * 60 + this.second;
  }


  /**
   * Addiert zur Zeit der aktuellen Instanz die Zeit @param{time} und liefert
   * das Ergebnis.
   *
   * @param {Time} time
   * @returns {Time}
   *
   * @memberOf Time
   */
  public add(time: Time): Time {
    const timeInSeconds = this.toSeconds() + time.toSeconds();
    return Time.createFromSeconds(timeInSeconds);
  }

  /**
   * Subrahiert von der Zeit der aktuellen Instanz die Zeit @param{time} und liefert
   * das Ergebnis.
   *
   * @param {Time} time
   * @returns {Time}
   *
   * @memberOf Time
   */
  public subtract(time: Time): Time {
    const timeInSeconds = this.toSeconds() - time.toSeconds();
    Assert.that(timeInSeconds >= 0);
    return Time.createFromSeconds(timeInSeconds);
  }
}



// tslint:disable-next-line:max-classes-per-file
@Converter(Time)
export class TimeConverter extends ConverterBase<Time, string> implements IConverter<Time, string> {

  constructor() {
    super(Time);
  }


  public convert(value: Time, options?: IConverterOptions): Nullable<string> {
    if (!Types.isPresent(value)) {
      return value as any as string;
    }

    return this.doConvert(value, () => value.toString());
  }

  public convertBack(value: string, options?: IConverterOptions): Nullable<Time> {
    if (!Types.isPresent(value)) {
      return value as any as Time;
    }

    return this.doConvertBack(value, () => Time.parse(value));
  }

}