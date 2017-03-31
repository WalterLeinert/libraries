import { TableOptions } from './tableOptions.interface';

/**
 * Optionen für EnumTable-Decorator
 * 
 * @export
 * @interface IEnumTableOptions
 */
// tslint:disable-next-line:interface-name
export interface IEnumTableOptions extends TableOptions {

  enumValues: any[];
}