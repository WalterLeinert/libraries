import 'rxjs/add/observable/of';
import { Observable } from 'rxjs/Observable';
import { ErrorObservable } from 'rxjs/Observable/ErrorObservable';

import { Assert } from '../../util/assert';
import { IServiceCrud } from './serviceCrud.interface';


/**
 * Virtueller Service: implementiert nur die find-Methode, welche
 * die Enum-Werte liefert
 * 
 * @export
 * @class EnumTableService
 * @implements {IServiceCrud}
 */
export class EnumTableService implements IServiceCrud {

  public constructor(private enumValues: any[]) {
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