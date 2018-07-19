import { Nullable } from '../types/nullable';
import { Types } from '../types/types';
import { ConverterBase } from './converter-base';
import { IConverterOptions } from './converter-options.interface';
import { IConverter } from './converter.interface';


// @Converter(Boolean)
export class BooleanConverter extends ConverterBase<boolean, string> implements IConverter<boolean, string> {

  constructor() {
    super(Boolean);
  }


  public convert(value: boolean, options?: IConverterOptions): Nullable<string> {
    if (!Types.isPresent(value)) {
      return value as any as string;
    }

    return this.doConvert(value, () => value.toString());
  }


  public convertBack(value: string, options?: IConverterOptions): Nullable<boolean> {
    if (!Types.isPresent(value)) {
      return value as any as boolean;
    }

    return this.doConvertBack(value, () => {
      const stringValue = value.toLowerCase();

      switch (stringValue) {
        case 'true':
        case '1':
          return true;

        case 'false':
        case '0':
          return false;

        default:
          throw new Error(`no valid boolean: '${value}'`);
      }
    });
  }
}