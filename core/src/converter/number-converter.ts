import { Nullable } from '../types/nullable';
import { Types } from '../types/types';
import { ConverterBase } from './converter-base';
import { IConverterOptions } from './converter-options.interface';
import { IConverter } from './converter.interface';


// @Converter(Date)
export class NumberConverter extends ConverterBase implements IConverter<number, string> {

  constructor() {
    super(Number);
  }


  public convert(value: number, options?: IConverterOptions): Nullable<string> {
    if (!Types.isPresent(value)) {
      return value as any as string;
    }

    return this.doConvert(value, () => value.toString());
  }


  public convertBack(value: string, options?: IConverterOptions): Nullable<number> {
    if (!Types.isPresent(value)) {
      return value as any as number;
    }

    return this.doConvertBack(value, () => {
      const val = +value;
      if (Number.isNaN(val)) {
        throw new Error(`no valid number: '${value}'`);
      }
      return val;
    });
  }
}