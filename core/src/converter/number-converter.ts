import { InvalidOperationException } from '../exceptions/invalidOperationException';
import { Nullable } from '../types/nullable';
import { Types } from '../types/types';
import { ConverterKey } from './converter-key';
import { IConverterOptions } from './converter-options.interface';
import { IConverter } from './converter.interface';

export const NUMBER_CONVERTER = ConverterKey.create(Number.name);

export class NumberFromStringConverter implements IConverter<string, number> {
  public convert(value: string, options?: IConverterOptions): Nullable<number> {
    if (!Types.isPresent(value)) {
      return value as any as number;
    }

    if (Types.isNullOrEmpty(value)) {
      throw new InvalidOperationException(`no valid number: '${value}'`);
    }

    const val = +value;
    if (Number.isNaN(val)) {
      throw new InvalidOperationException(`no valid number: '${value}'`);
    }
    return val;
  }
}

// tslint:disable-next-line:max-classes-per-file
export class StringFromNumberConverter implements IConverter<number, string> {
  public convert(value: number, options?: IConverterOptions): Nullable<string> {
    if (!Types.isPresent(value)) {
      return value as any as string;
    }
    return value.toString();
  }
}