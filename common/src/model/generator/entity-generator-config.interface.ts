import { TableMetadata } from '../metadata/tableMetadata';
import { IValueGenerator } from './value-generator.interface';


export interface IEntityGeneratorColumnConfig {

  /**
   * Dictionary:
   * key: Propertyname
   * value: ein spezieller Value-Generator
   */
  [key: string]: IValueGenerator;
}


/**
 * Interface für die Konfiguration des Entitygenerators
 *
 * @export
 * @interface IEntityGeneratorConfig
 */
export interface IEntityGeneratorConfig {
  /**
   * Anzahl der initial zu erzeugenden Items
   *
   * @type {number}
   * @memberOf IEntityGeneratorConfig
   */
  count: number;

  /**
   * Anzahl der maximal erzeugbaren Items
   *
   * @type {number}
   * @memberOf IEntityGeneratorConfig
   */
  maxCount?: number;

  /**
   * Generator zum Erzeugen von Entity-Ids
   *
   * @type {IValueGenerator}
   * @memberOf IEntityGeneratorConfig
   */
  idGenerator: IValueGenerator;

  /**
   * Metdaten der Tabelle/Entity
   *
   * @type {TableMetadata}
   * @memberOf IEntityGeneratorConfig
   */
  tableMetadata: TableMetadata;

  /**
   * Spaltenkonfiguration
   */
  columns?: IEntityGeneratorColumnConfig;
}