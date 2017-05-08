import { Nullable } from '../types/nullable';
import { Types } from '../types/types';
import { ConverterKey } from './converter-key';
import { IConverterOptions } from './converter-options.interface';
import { IConverter } from './converter.interface';

export const DATE_CONVERTER = new ConverterKey(String.name, Date.name);

export class DateFromStringConverter implements IConverter<string, Date> {
  public convert(value: string, options?: IConverterOptions): Nullable<Date> {
    if (!Types.isPresent(value)) {
      return value as any as Date;
    }
    return new Date(value);
  }
}

// tslint:disable-next-line:max-classes-per-file
export class StringFromDateConverter implements IConverter<Date, string> {
  public convert(value: Date, options?: IConverterOptions): Nullable<string> {
    if (!Types.isPresent(value)) {
      return value as any as string;
    }
    return value.toISOString();
  }
}