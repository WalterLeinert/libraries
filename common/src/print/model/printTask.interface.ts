import { IPrintJob } from './printJob.interface';
import { ITableInfo } from './tableInfo.interface';

/**
 * Druck/Formatierauftrag
 *
 * @export
 * @interface IPrintTask
 */
export interface IPrintTask {

  /**
   * Name des Reports
   *
   * @type {string}
   * @memberOf IPrintTask
   */
  report: string;

  /**
   * Schemainformationen zu den Tabellen
   *
   * @type {ITableInfo[]}
   * @memberOf IPrintTask
   */
  tables: ITableInfo[];

  /**
   * Druckjobs
   *
   * @type {IPrintJob[]}
   * @memberOf IPrintTask
   */
  printJobs: IPrintJob[];
}
