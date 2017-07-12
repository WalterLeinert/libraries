import { CoreInjector } from '../di/core-injector';
import { SimpleStringifyer } from './simple-stringifyer';
import { IStringifyer } from './stringifyer.interface';
import { STRINGIFYER } from './stringifyer.token';


export class Core {
  public static readonly DEFAULT_STRINGIFYER: IStringifyer = new SimpleStringifyer();

  public static stringify(value: any): string {
    const stringifyer = CoreInjector.instance.getInstance<IStringifyer>(STRINGIFYER, Core.DEFAULT_STRINGIFYER);
    return stringifyer.stringify(value);
  }
}