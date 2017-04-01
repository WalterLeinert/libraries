// fluxgate
import { Assert, IToString } from '@fluxgate/common';

import { Service } from '../angular/services/service';
import { DeleteItemCommand } from './delete-item-command';
import { FindItemsCommand } from './find-items-command';
import { SetCurrentItemCommand } from './set-current-item-command';
import { Store } from './store';
import { UpdateItemCommand } from './update-item-command';

/**
 * 
 * 
 * @export
 * @class ServiceRequests
 * @template T
 * @template TId
 * @template TService
 */
export abstract class ServiceRequests<T, TId extends IToString, TService extends Service<T, TId>> {

  protected constructor(private _storeId: string, private service: TService, private store: Store) {
    Assert.notNullOrEmpty(_storeId);
    Assert.notNull(service);
    Assert.notNull(store);
  }

  public get storeId(): string {
    return this._storeId;
  }

  public setCurrent(item: T): void {
    this.store.dispatch(new SetCurrentItemCommand(this._storeId, item));
  }

  public find(): void {
    this.service.find().subscribe((items) => {
      this.store.dispatch(new FindItemsCommand(this._storeId, items));
    });
  }

  public update(item: T): void {
    this.service.update(item).subscribe((elem) => {
      this.store.dispatch(new UpdateItemCommand(this._storeId, elem));
    });
  }

  public delete(id: TId): void {
    this.service.delete(id).subscribe((result) => {
      this.store.dispatch(new DeleteItemCommand(this._storeId, result.id));
    });
  }
}
