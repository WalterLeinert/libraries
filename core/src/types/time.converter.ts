// tslint:disable:max-classes-per-file
import { ConverterKey } from '../../src/converter/converter-key';
import { IConverterOptions } from '../../src/converter/converter-options.interface';
import { IConverterTuple } from '../../src/converter/converter-registry';
import { IConverter } from '../../src/converter/converter.interface';
import { InvalidOperationException } from '../../src/exceptions/invalidOperationException';
import { Nullable } from '../../src/types/nullable';
import { Time } from '../../src/types/time';
import { Types } from '../../src/types/types';


export class TimeFromStringConverter implements IConverter<string, Time> {
  public convert(value: string, options?: IConverterOptions): Nullable<Time> {
    if (!Types.isPresent(value)) {
      return value as any as Time;
    }

    if (Types.isNullOrEmpty(value)) {
      throw new InvalidOperationException(`no valid Time: '${value}'`);
    }

    return Time.parse(value);
  }
}

export class StringFromTimeConverter implements IConverter<Time, string> {
  public convert(value: Time, options?: IConverterOptions): Nullable<string> {
    if (!Types.isPresent(value)) {
      return value as any as string;
    }
    return value.toString();
  }
}


export const TIME_CONVERTER = ConverterKey.create(String.name, 'Time');

export const TIME_CONVERTER_TUPLE: IConverterTuple<string, Time> = {
  from: new TimeFromStringConverter(),
  to: new StringFromTimeConverter()
};