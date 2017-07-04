import { Assert } from '@fluxgate/core';

import { ColumnMetadata } from './columnMetadata';


export abstract class GroupMetadata {
  private _groupColumns: ColumnMetadata[] = [];

  protected constructor(private _columnNames: string[]) {
  }

  public addColumnName(name: string) {
    Assert.notNullOrEmpty(name);
    this._columnNames.push(name);
  }

  public resolveColumns(resolver: (name: string) => ColumnMetadata) {
    this._columnNames.forEach((name) => {
      this._groupColumns.push(resolver(name));
    });
  }

  public get groupColumns(): ColumnMetadata[] {
    return this._groupColumns;
  }

  public get columnNames(): string[] {
    return this._columnNames;
  }
}