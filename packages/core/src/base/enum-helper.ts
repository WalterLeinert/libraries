import { Types } from '../types/types';
import { BidirectionalMap } from './bidirectional-map';

export class EnumHelper {

  /**
   * Liefert eine BidirectionalMap zur Abbildung von Namen der Enumwerte auf die Werte bzw. umgekehrt.
   * @param e
   */
  public static getBidirectionalMap<T extends number>(e: any): BidirectionalMap<string, T> {
    return new BidirectionalMap<string, T>(EnumHelper.getNames(e), EnumHelper.getValues<T>(e));
  }


  /**
   * liefert ein Array von Tupeln (name, value) für den Enum @param{e}
   * @param e
   */
  public static getNamesAndValues<T extends number>(e: any) {
    return EnumHelper.getNames(e).map((n) => ({ name: n, value: e[n] as T }));
  }

  /**
   * Liefert die Namen der Aufzählungswerte des Enums @param{e}
   *
   * @param e
   * @returns - Namen der Enumwerte
   */
  public static getNames(e: any): string[] {
    return EnumHelper.getObjValues(e).filter((v) => Types.isString(v)) as string[];
  }

  /**
   * Liefert ein Array mit den Enumwerten (nur numerische Werte)
   * @param e
   */
  public static getValues<T extends number>(e: any): T[] {
    return EnumHelper.getObjValues(e).filter((v) => typeof v === 'number') as T[];
  }

  /**
   * Liefert ein Array mit den Enumwerten
   * @param e
   */
  private static getObjValues(e: any): Array<number | string> {
    return Object.keys(e).map((k) => e[k]);
  }
}