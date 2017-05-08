// tslint:disable:max-classes-per-file
import { ConverterKey } from '../../src/converter/converter-key';
import { IConverterOptions } from '../../src/converter/converter-options.interface';
import { IConverterTuple } from '../../src/converter/converter-registry';
import { IConverter } from '../../src/converter/converter.interface';
import { InvalidOperationException } from '../../src/exceptions/invalidOperationException';
import { Nullable } from '../../src/types/nullable';
import { ShortTime } from '../../src/types/shortTime';
import { Types } from '../../src/types/types';


export class ShortTimeFromStringConverter implements IConverter<string, ShortTime> {
  public convert(value: string, options?: IConverterOptions): Nullable<ShortTime> {
    if (!Types.isPresent(value)) {
      return value as any as ShortTime;
    }

    if (Types.isNullOrEmpty(value)) {
      throw new InvalidOperationException(`no valid ShortTime: '${value}'`);
    }

    return ShortTime.parse(value);
  }
}

export class StringFromShortTimeConverter implements IConverter<ShortTime, string> {
  public convert(value: ShortTime, options?: IConverterOptions): Nullable<string> {
    if (!Types.isPresent(value)) {
      return value as any as string;
    }
    return value.toString();
  }
}


export const SHORTTIME_CONVERTER = ConverterKey.create(String.name, 'ShortTime');

export const SHORTTIME_CONVERTER_TUPLE: IConverterTuple<string, ShortTime> = {
  from: new ShortTimeFromStringConverter(),
  to: new StringFromShortTimeConverter()
};
