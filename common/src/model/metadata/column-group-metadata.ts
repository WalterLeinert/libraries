import { IColumnGroupOptions } from '../decorator/column-group';
import { GroupMetadata } from './group-metadata';

// tslint:disable-next-line:max-classes-per-file
export class ColumnGroupMetadata extends GroupMetadata {

  public constructor(private _name: string, columnNames: string[], private _options: IColumnGroupOptions) {
    super(columnNames);
  }

  public get name(): string {
    return this._name;
  }

  public get options(): IColumnGroupOptions {
    return this._options;
  }
}