import { Inject } from '@angular/core';

// fluxgate
import { IToString } from '@fluxgate/common';

import { Service } from '../angular/services/service';
import { AppStore } from './app-store';
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
export class ServiceRequests<T, TId extends IToString, TService extends Service<T, TId>> {

  constructor(private _storeId: string, private service: TService, @Inject(AppStore) private store: Store) {
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
