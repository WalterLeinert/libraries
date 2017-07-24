import { Assert } from '@fluxgate/core';

import { ColumnMetadata } from './columnMetadata';


export abstract class GroupMetadata {

  protected constructor(private _columnNames: string[], private _groupColumns: ColumnMetadata[]) {
    Assert.notNullOrEmpty(_columnNames);
    Assert.notNullOrEmpty(_groupColumns);
  }

  public get groupColumns(): ColumnMetadata[] {
    return this._groupColumns;
  }

  public get columnNames(): string[] {
    return this._columnNames;
  }
}