import { Types } from '../types/types';

export class EnumHelper {
  public static getNamesAndValues<T extends number>(e: any) {
    return EnumHelper.getNames(e).map((n) => ({ name: n, value: e[n] as T }));
  }

  public static getNames(e: any) {
    return EnumHelper.getObjValues(e).filter((v) => Types.isString(v)) as string[];
  }

  public static getValues<T extends number>(e: any) {
    return EnumHelper.getObjValues(e).filter((v) => typeof v === 'number') as T[];
  }

  private static getObjValues(e: any): Array<number | string> {
    return Object.keys(e).map((k) => e[k]);
  }
}