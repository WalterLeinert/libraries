import { Converter } from '../../src/converter';
import { ConverterKey } from '../../src/converter/converter-key';
import { IConverterOptions } from '../../src/converter/converter-options.interface';
import { IConverter } from '../../src/converter/converter.interface';
import { InvalidOperationException } from '../../src/exceptions/invalidOperationException';
import { Nullable } from '../../src/types/nullable';
import { Types } from '../../src/types/types';



export type ShortInts = 1 | 2 | 3;

export const SHORT_INT_CONVERTER = ConverterKey.create(String.name, 'ShortInt');


@Converter(SHORT_INT_CONVERTER)
export class ShortInt {
  public static NAME = ShortInt.name;

  constructor(private _value: ShortInts) {
  }

  public get value(): ShortInts {
    return this._value;
  }

  public toString() {
    return this._value.toString();
  }
}



// tslint:disable-next-line:max-classes-per-file
export class ShortIntFromStringConverter implements IConverter<string, ShortInt> {
  public convert(value: string, options?: IConverterOptions): Nullable<ShortInt> {
    if (!Types.isPresent(value)) {
      return value as any as ShortInt;
    }

    if (Types.isNullOrEmpty(value)) {
      throw new InvalidOperationException(`no valid ShortInt: '${value}'`);
    }

    const val = +value;
    if (val <= 0 || val > 3) {
      throw new InvalidOperationException(`no valid ShortInt: '${value}'`);
    }
    return new ShortInt(val as ShortInts);
  }
}

// tslint:disable-next-line:max-classes-per-file
export class StringFromShortIntConverter implements IConverter<ShortInt, string> {
  public convert(value: ShortInt, options?: IConverterOptions): Nullable<string> {
    if (!Types.isPresent(value)) {
      return value as any as string;
    }
    return value.toString();
  }
}