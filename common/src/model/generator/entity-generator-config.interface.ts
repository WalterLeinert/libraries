import { TableMetadata } from '../metadata/tableMetadata';
import { IValueGenerator } from './value-generator.interface';

export interface IEntityGeneratorConfig {
  count: number;
  maxCount?: number;
  idGenerator: IValueGenerator;
  tableMetadata: TableMetadata;

  columns?: {
    [key: string]: IValueGenerator
  };
}