import { Observable } from 'rxjs/Observable';
import { Subscriber } from 'rxjs/Subscriber';

import { Assert, IException, IQuery, NotSupportedException } from '@fluxgate/core';

import { TableMetadata } from '../../model/metadata';
import { EnumTableService, FindResult } from '../../model/service';
import {
  ErrorCommand, FindingItemsCommand, ItemsFoundCommand, ItemsQueriedCommand,
  QueryingItemsCommand
} from '../command';
import { ReduxStore } from '../decorators/redux-store.decorator';
import { ICoreServiceState } from '../state/core-service-state.interface';
import { ICrudServiceState } from '../state/crud-service-state.interface';
import { CommandStore } from '../store/command-store';
import { GenericStore } from '../store/generic-store';
import { Store } from '../store/store';
import { CrudServiceRequests } from './crud-service-requests';
import { ICrudServiceRequests } from './crud-service-requests.interface';
import { ServiceRequests } from './service-requests';


/**
 * Hilfsklasse für die Anbindung von expliziten Enum-Werten z.B. über den Decorator EnumTable.
 * Es ist nur die Methode find() implemetiert, die die Enum-Werte liefert.
 *
 * @export
 * @class EnumTableServiceRequests
 * @extends {CoreServiceRequests<any>}
 */
export class EnumTableServiceRequests extends ServiceRequests implements ICrudServiceRequests<any, any> {

  public constructor(private _tableMetadata: TableMetadata, store: Store, private enumValues: any[]) {
    super(new GenericStore<any, any>(CommandStore.NoId), store, EnumTableStore.ID);
    Assert.notNullOrEmpty(enumValues, 'enumValues');
  }


  public find(): Observable<any[]> {
    return Observable.create((observer: Subscriber<any[]>) => {

      try {
        this.dispatch(new FindingItemsCommand(this));

        Observable.of(new FindResult<any>(this.enumValues, -1)).subscribe(
          (findResult) => {
            this.dispatch(new ItemsFoundCommand(this, findResult.items));
            observer.next(findResult.items);
          },
          (exc: IException) => {
            this.dispatch(new ErrorCommand(this, exc));
            throw exc;
          });

      } catch (exc) {
        observer.error(exc);
      }
    });
  }


  public query(query: IQuery): Observable<any[]> {
    throw new NotSupportedException();
  }

  public findById<T>(id: any): Observable<T> {
    throw new NotSupportedException();
  }

  public create(item: any): Observable<any> {
    throw new NotSupportedException();
  }

  public update(item: any): Observable<any> {
    throw new NotSupportedException();
  }

  public delete(id: any): Observable<any> {
    throw new NotSupportedException();
  }

  public getEntityId(item: any): any {
    throw new NotSupportedException();
  }

  public getModelClassName(): string {
    return this._tableMetadata.className;
  }



  public getCrudState(storeId: string): ICrudServiceState<any, any> {
    return super.getStoreState(storeId) as ICrudServiceState<any, any>;
  }

}



// tslint:disable-next-line:max-classes-per-file
@ReduxStore()
export class EnumTableStore extends CommandStore<ICoreServiceState<any>> {
  public static ID = 'enumTable';

  constructor() {
    super(EnumTableStore.ID, CrudServiceRequests.INITIAL_STATE);
  }
}