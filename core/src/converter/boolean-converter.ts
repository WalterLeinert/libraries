import { InvalidOperationException } from '../exceptions/invalidOperationException';
import { Nullable } from '../types/nullable';
import { Types } from '../types/types';
import { ConverterKey } from './converter-key';
import { IConverterOptions } from './converter-options.interface';
import { IConverter } from './converter.interface';

export const BOOLEAN_CONVERTER = ConverterKey.create(Boolean.name);

export class BooleanFromStringConverter implements IConverter<string, boolean> {
  public convert(value: string, options?: IConverterOptions): Nullable<boolean> {
    if (!Types.isPresent(value)) {
      return value as any as boolean;
    }

    if (value === '1' || value.toLowerCase() === 'true') {
      return true;
    }

    if (value === '0' || value.toLowerCase() === 'false') {
      return false;
    }

    throw new InvalidOperationException(`no valid boolean: ${value}`);
  }
}

// tslint:disable-next-line:max-classes-per-file
export class StringFromBooleanConverter implements IConverter<boolean, string> {
  public convert(value: boolean, options?: IConverterOptions): Nullable<string> {
    if (!Types.isPresent(value)) {
      return value as any as string;
    }
    return value.toString();
  }
}