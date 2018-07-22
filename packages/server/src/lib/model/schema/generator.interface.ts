import { TableInfo } from './tableInfo';

export interface IGenerator {
  generateFiles(tableInfos: TableInfo[]);
  generateFile(fileName: string, tableInfos: TableInfo[]);
}