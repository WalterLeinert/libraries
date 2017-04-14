import 'rxjs/add/observable/of';
import { Observable } from 'rxjs/Observable';

import { Assert, NotSupportedException } from '@fluxgate/core';

import { TableMetadata } from '../metadata/tableMetadata';
import { IService } from './service.interface';


/**
 * Virtueller Service: implementiert nur die find-Methode, welche
 * die Enum-Werte liefert
 *
 * @export
 * @class EnumTableService
 * @implements {IServiceCrud}
 */
export class EnumTableService implements IService {

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
  public find(): Observable<any[]> {
    return Observable.of(this.enumValues);
  }

  public getModelClassName(): string {
    return this._tableMetadata.className;
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

  public create(item: any): any {
    return Observable.throw(`Not supported`);
  }

  public findById(id: any): any {
    return Observable.throw(`Not supported`);
  }

  public update(item: any): any {
    return Observable.throw(`Not supported`);
  }

  public delete(id: any): any {
    return Observable.throw(`Not supported`);
  }
}