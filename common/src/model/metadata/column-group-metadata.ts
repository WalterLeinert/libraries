import { Assert, Funktion } from '@fluxgate/core';

import { IColumnGroupOptions } from '../decorator/column-group';
import { ColumnMetadata } from './columnMetadata';
import { GroupMetadata } from './group-metadata';

// tslint:disable-next-line:max-classes-per-file
export class ColumnGroupMetadata extends GroupMetadata {

  public constructor(private _name: string, columnNames: string[], private _options: IColumnGroupOptions,
    groupColumns: ColumnMetadata[]) {
    super(columnNames, groupColumns);

    Assert.notNullOrEmpty(_name);
  }


  public get name(): string {
    return this._name;
  }

  public get options(): IColumnGroupOptions {
    return this._options;
  }
}