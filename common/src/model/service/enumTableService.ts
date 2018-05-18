
import { Observable, of, throwError as observableThrowError } from 'rxjs';

import { Assert, NotSupportedException } from '@fluxgate/core';

import { TableMetadata } from '../metadata/tableMetadata';
import { FindResult } from './find-result';
import { IService } from './service.interface';
import { StatusFilter } from './status-filter';
import { IStatusQuery } from './status-query';

/**
 * Virtueller Service: implementiert nur die find-Methode, welche
 * die Enum-Werte liefert
 *
 * @export
 * @class EnumTableService
 * @implements {IService}
 */
export class EnumTableService implements IService<any, any> {

  public constructor(private _tableMetadata: TableMetadata, private enumValues: any[]) {
    Assert.notNullOrEmpty(enumValues, 'enumValues');
  }

  /**
   * Liefert die die Liste der Enum-Werte als @see{Observable}.
   *
   * @returns {Observable<any[]>}
   *
   * @memberOf EnumTableService
   */
  public find(filter: StatusFilter): Observable<FindResult<any>> {
    return of(new FindResult<any>(this.enumValues, -1));
  }

  public getModelClassName(): string {
    return this._tableMetadata.className;
  }

  public getTableName(): string {
    return this._tableMetadata.tableName;
  }

  public query(query: IStatusQuery): any {
    throw new NotSupportedException();
  }


  public getEntityId(item: any): any {
    throw new NotSupportedException();
  }

  public setEntityId(item: any, id: any) {
    throw new NotSupportedException();
  }

  public getUrl(): string {
    throw new NotSupportedException();
  }

  public getTopic(): string {
    throw new NotSupportedException();
  }

  public getTopicPath(): string {
    throw new NotSupportedException();
  }

  public get tableMetadata(): TableMetadata {
    return this._tableMetadata;
  }

  public create(item: any): any {
    return observableThrowError(`Not supported`);
  }

  public findById(id: any): any {
    return observableThrowError(`Not supported`);
  }

  public update(item: any): any {
    return observableThrowError(`Not supported`);
  }

  public delete(id: any): any {
    return observableThrowError(`Not supported`);
  }
}