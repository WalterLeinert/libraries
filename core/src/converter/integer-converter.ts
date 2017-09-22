import { InvalidOperationException } from '../../src/exceptions/invalidOperationException';
import { Nullable } from '../types/nullable';
import { Types } from '../types/types';
import { IConverterOptions } from './converter-options.interface';
import { IConverter } from './converter.interface';
import { NumberConverter } from './number-converter';


// @Converter(Number)
export class IntegerConverter extends NumberConverter {
  public static readonly PATTERN = /^-?[0-9]+$/;

  constructor() {
    super();
  }


  public convert(value: number, options?: IConverterOptions): Nullable<string> {
    const rval = super.convert(value, options);

    if (!Number.isInteger(value)) {
      throw new InvalidOperationException(`no valid integer: '${value}'`);
    }

    return rval;
  }


  public convertBack(value: string, options?: IConverterOptions): Nullable<number> {
    if (!IntegerConverter.PATTERN.test(value)) {
      throw new InvalidOperationException(`no valid integer (pattern): '${value}'`);
    }
    return super.convertBack(value, options);
  }
}