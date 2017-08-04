import { Assert, Funktion } from '@fluxgate/core';

import { IColumnGroupOptions } from '../decorator/column-group';
import { ColumnMetadata } from './columnMetadata';
import { GroupMetadata } from './group-metadata';

// tslint:disable-next-line:max-classes-per-file
export class ColumnGroupMetadata extends GroupMetadata {
  public static readonly DEFAULT_NAME = '-default-';

  public constructor(private _name: string, columnNames: string[], private _options: IColumnGroupOptions,
    groupColumns: ColumnMetadata[], private _hidden: boolean = false, private _derived: boolean, isAbstract: boolean) {
    super(columnNames, groupColumns, isAbstract);

    Assert.notNullOrEmpty(_name);
  }


  public get name(): string {
    return this._name;
  }

  public get options(): IColumnGroupOptions {
    return this._options;
  }

  /**
   * falls true, wird die column group nicht speziell angezeigt, sondern nur die Controls
   * Hinweis: markiert die künstliche column group, die angelegt wird, falls keine
   * column groups explizit definiert sind!
   */
  public get hidden(): boolean {
    return this._hidden;
  }

  public get derived(): boolean {
    return this._derived;
  }
}