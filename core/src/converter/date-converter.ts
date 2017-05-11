import { Nullable } from '../types/nullable';
import { Types } from '../types/types';
import { ConverterBase } from './converter-base';
import { IConverterOptions } from './converter-options.interface';
import { IConverter } from './converter.interface';


// @Converter(Date)
export class DateConverter extends ConverterBase implements IConverter<Date, String> {

  constructor() {
    super(Date);
  }


  public convert(value: Date, options?: IConverterOptions): Nullable<string> {
    if (!Types.isPresent(value)) {
      return value as any as string;
    }

    return this.doConvert(value, () => value.toISOString());
  }


  public convertBack(value: string, options?: IConverterOptions): Nullable<Date> {
    if (!Types.isPresent(value)) {
      return value as any as Date;
    }

    return this.doConvertBack(value, () => {
      const rval = new Date(value);
      if (isNaN(rval.getTime())) {
        throw new Error(`Date constructor failed.`);
      }
      return rval;
    });
  }
}