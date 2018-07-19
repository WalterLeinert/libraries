import { Core } from '../diagnostics/core';
import { JsonDumper } from '../diagnostics/json-dumper';
import { Nullable } from '../types/nullable';
import { Types } from '../types/types';
import { ConverterBase } from './converter-base';
import { IConverterOptions } from './converter-options.interface';
import { IConverter } from './converter.interface';


// @Converter(Error)
export class ErrorConverter extends ConverterBase<Error, string> implements IConverter<Error, string> {

  constructor() {
    super(Error);
  }


  public convert(value: Error, options?: IConverterOptions): Nullable<string> {
    if (!Types.isPresent(value)) {
      return value as any as string;
    }

    return this.doConvert(value, () => {
      const rval = {};
      const propertyKeys = Reflect.ownKeys(value);
      for (const propertyKey of propertyKeys) {
        rval[propertyKey.toString()] = value[propertyKey.toString()];
      }

      //
      // Hinweis: hier darf nicht Core.stringify verwendet werden, da sonst ggf. über den mittels
      // dependency injection injizierten JsonDumper und die Defaultoptionen (showInfo: true) ein JSON-Format
      // erzeugt wird, was nicht über JSON.parse gelesen werden kann!
      //
      return JSON.stringify(rval);
    });
  }


  public convertBack(value: string, options?: IConverterOptions): Nullable<Error> {
    if (!Types.isPresent(value)) {
      return value as any as Error;
    }

    return this.doConvertBack(value, () => {
      const err = JSON.parse(value);
      const rval = new Error();

      const propertyKeys = Reflect.ownKeys(err);
      for (const propertyKey of propertyKeys) {
        const propertyName = propertyKey.toString();
        Object.defineProperty(rval, propertyName, {
          enumerable: false,
          configurable: false,
          writable: true,
          value: 'static'
        });
        rval[propertyName] = err[propertyName];
      }
      return rval;
    });
  }
}