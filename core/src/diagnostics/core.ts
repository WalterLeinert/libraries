import { CoreInjector } from '../di/core-injector';
import { SimpleStringifyer } from './simple-stringifyer';
import { IStringifyer } from './stringifyer.interface';
import { STRINGIFYER } from './stringifyer.token';


export class Core {
  private static _stringifyer: IStringifyer;

  public static stringify(value: any): string {
    if (!Core._stringifyer) {
      Core._stringifyer = CoreInjector.instance.getInstance<IStringifyer>(STRINGIFYER, new SimpleStringifyer());
    }

    return Core._stringifyer.stringify(value);
  }
}