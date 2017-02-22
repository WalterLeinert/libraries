import { IEnumTableOptions } from './enumTableOptions.interface';

/**
 * Optionen für EnumTable-Decorator
 * 
 * @export
 * @interface EnumTableOptions
 */
// tslint:disable-next-line:interface-name
export class EnumTableOptions implements IEnumTableOptions {
  /**
   * DB Tabellen-/Viewname
   */
  public name?: string;

  /**
   * true, falls View und keine Tabelle
   */
  public isView?: boolean;

  public enumValues: any[];
}