import { Nullable } from '../types/nullable';
import { Types } from '../types/types';
import { ConverterKey } from './converter-key';
import { IConverterOptions } from './converter-options.interface';
import { IConverter } from './converter.interface';

export const ERROR_CONVERTER = ConverterKey.create(Error.name);

export class ErrorFromStringConverter implements IConverter<string, Error> {
  public convert(value: string, options?: IConverterOptions): Nullable<Error> {
    if (!Types.isPresent(value)) {
      return value as any as Error;
    }

    if (Types.isNullOrEmpty(value)) {
      throw new Error(`no valid Error: '${value}'`);
    }

    return JSON.parse(value) as Error;
  }
}

// tslint:disable-next-line:max-classes-per-file
export class StringFromErrorConverter implements IConverter<Error, string> {
  public convert(value: Error, options?: IConverterOptions): Nullable<string> {
    if (!Types.isPresent(value)) {
      return value as any as string;
    }
    return JSON.stringify(value);
  }
}