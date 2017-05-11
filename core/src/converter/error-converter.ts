import { Nullable } from '../types/nullable';
import { Types } from '../types/types';
import { ConverterBase } from './converter-base';
import { IConverterOptions } from './converter-options.interface';
import { IConverter } from './converter.interface';


// @Converter(Error)
export class ErrorConverter extends ConverterBase implements IConverter<Error, String> {

  constructor() {
    super(Error);
  }


  public convert(value: Error, options?: IConverterOptions): Nullable<string> {
    if (!Types.isPresent(value)) {
      return value as any as string;
    }

    return this.doConvert(value, () => JSON.stringify(value));
  }


  public convertBack(value: string, options?: IConverterOptions): Nullable<Error> {
    if (!Types.isPresent(value)) {
      return value as any as Error;
    }

    return this.doConvertBack(value, () => {
      const err = JSON.parse(value);
      const rval = new Error(err.message);
      rval.name = err.name;
      rval.stack = err.stack;

      return rval;
    });
  }
}