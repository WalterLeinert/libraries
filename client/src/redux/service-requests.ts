// fluxgate
import { Assert, IToString } from '@fluxgate/common';

import { Service } from '../angular/services/service';
import { CreateItemCommand } from './create-item-command';
import { DeleteItemCommand } from './delete-item-command';
import { FindItemByIdCommand } from './find-item-by-id-command';
import { FindItemsCommand } from './find-items-command';
import { SetCurrentItemCommand } from './set-current-item-command';
import { Store } from './store';
import { UpdateItemCommand } from './update-item-command';

/**
 * Realisiert die Rest-API Operationen und führt ein dispatch der jeweiligen Kommandos durch.
 *
 * @export
 * @class ServiceRequests
 * @template T
 * @template TId
 * @template TService
 */
export abstract class ServiceRequests<T, TId extends IToString, TService extends Service<T, TId>> {

  protected constructor(private _storeId: string, private _service: TService, private _store: Store) {
    Assert.notNullOrEmpty(_storeId);
    Assert.notNull(_service);
    Assert.notNull(_store);
  }

  /**
   * Liefert die Store-Id
   *
   * @readonly
   * @type {string}
   * @memberOf ServiceRequests
   */
  public get storeId(): string {
    return this._storeId;
  }

  /**
   * Setzt das aktuelle Item.
   *
   * @param {T} item
   *
   * @memberOf ServiceRequests
   */
  public setCurrent(item: T): void {
    this.store.dispatch(new SetCurrentItemCommand(this._storeId, item));
  }

  /**
   * Führt die update-Methode aus und führt ein dispatch des zugehörigen Kommandos durch.
   *
   * @param {T} item
   *
   * @memberOf ServiceRequests
   */
  public create(item: T): void {
    this.service.create(item).subscribe((elem) => {
      this.store.dispatch(new CreateItemCommand(this._storeId, elem));
    });
  }


  /**
   * Führt die find-Methode aus und führt ein dispatch des zugehörigen Kommandos durch.
   *
   * @memberOf ServiceRequests
   */
  public find(): void {
    this.service.find().subscribe((items) => {
      this.store.dispatch(new FindItemsCommand(this._storeId, items));
    });
  }

  public findById(id: TId): void {
    this.service.findById(id).subscribe((elem) => {
      this.store.dispatch(new FindItemByIdCommand(this._storeId, elem));
    });
  }


  /**
   * Führt die update-Methode aus und führt ein dispatch des zugehörigen Kommandos durch.
   *
   * @param {T} item
   *
   * @memberOf ServiceRequests
   */
  public update(item: T): void {
    this.service.update(item).subscribe((elem) => {
      this.store.dispatch(new UpdateItemCommand(this._storeId, elem));
    });
  }

  /**
   * Führt die delete-Methodes aus und führt ein dispatch des zugehörigen Kommandos durch.
   *
   * @param {TId} id
   *
   * @memberOf ServiceRequests
   */
  public delete(id: TId): void {
    this.service.delete(id).subscribe((result) => {
      this.store.dispatch(new DeleteItemCommand(this._storeId, result.id));
    });
  }

  protected get service(): TService {
    return this._service;
  }

  protected get store(): Store {
    return this._store;
  }
}