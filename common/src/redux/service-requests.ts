// fluxgate
import { Assert, IException, IToString, Types } from '@fluxgate/core';

import { IEntity } from '../model/entity.interface';
import {
  CreatingItemCommand, DeletingItemCommand, ErrorCommand,
  FindingItemByIdCommand, FindingItemsCommand, IServiceState,
  ItemCreatedCommand, ItemDeletedCommand, ItemFoundByIdCommand, ItemsFoundCommand,
  ItemUpdatedCommand, ServiceRequestStates,
  SetCurrentItemCommand, Store, UpdatingItemCommand
} from './';

import { IService } from '../model/service/service.interface';


/**
 * Realisiert die Rest-API Operationen und führt ein dispatch der jeweiligen Kommandos durch.
 *
 * @export
 * @class ServiceRequests
 * @template T
 * @template TId
 * @template TService
 */
export abstract class ServiceRequests<T extends IEntity<TId>, TId extends IToString,
  TService extends IService<T, TId>> {

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
   * Führt die update-Methode async aus und führt ein dispatch des zugehörigen Kommandos durch.
   *
   * @param {T} item
   *
   * @memberOf ServiceRequests
   */
  public create(item: T): void {
    this.store.dispatch(new CreatingItemCommand(this._storeId, item));

    this.service.create(item).subscribe(
      (elem) => {
        this.store.dispatch(new ItemCreatedCommand(this._storeId, elem));
      },
      (exc: IException) => {
        this.store.dispatch(new ErrorCommand(this._storeId, exc));
      });
  }

  /**
   * Führt die update-Methode aus und führt ein dispatch des zugehörigen Kommandos durch.
   *
   * @param {T} item
   *
   * @memberOf ServiceRequests
   */
  public createSync(item: T): void {
    this.service.create(item).subscribe(
      (elem) => {
        this.store.dispatch(new ItemCreatedCommand(this._storeId, elem));
      },
      (exc: IException) => {
        this.store.dispatch(new ErrorCommand(this._storeId, exc));
      });
  }


  /**
   * Führt die find-Methode async aus und führt ein dispatch des zugehörigen Kommandos durch.
   * @param {boolean} useCache - falls true, werden nur die Daten aus dem State übernommen; sonst Servercall
   * @memberOf ServiceRequests
   */
  public find(useCache: boolean = false): void {
    const state = this.getStoreState<T, TId>(this._storeId);

    this.store.dispatch(new FindingItemsCommand(this._storeId));

    const finder = () => {
      this.service.find().subscribe(
        (items) => {
          this.store.dispatch(new ItemsFoundCommand(this._storeId, items));
        },
        (exc: IException) => {
          this.store.dispatch(new ErrorCommand(this._storeId, exc));
        });
    };

    if (useCache) {
      if (state.state === ServiceRequestStates.UNDEFINED) {
        finder();

      } else {
        // items aus dem State liefern
        this.store.dispatch(new ItemsFoundCommand(this._storeId, [...state.items]));
      }
    } else {
      finder();
    }
  }


  /**
   * Führt die find-Methode aus und führt ein dispatch des zugehörigen Kommandos durch.
   *
   * @memberOf ServiceRequests
   */
  public findSync(): void {
    this.service.find().subscribe(
      (items) => {
        this.store.dispatch(new ItemsFoundCommand(this._storeId, items));
      },
      (exc: IException) => {
        this.store.dispatch(new ErrorCommand(this._storeId, exc));
      });
  }


  public findById(id: TId): void {
    this.store.dispatch(new FindingItemByIdCommand(this._storeId, id));

    this.service.findById(id).subscribe(
      (elem) => {
        this.store.dispatch(new ItemFoundByIdCommand(this._storeId, elem));
      },
      (exc: IException) => {
        this.store.dispatch(new ErrorCommand(this._storeId, exc));
      });
  }

  public findByIdSync(id: TId): void {
    this.service.findById(id).subscribe(
      (elem) => {
        this.store.dispatch(new ItemFoundByIdCommand(this._storeId, elem));
      },
      (exc: IException) => {
        this.store.dispatch(new ErrorCommand(this._storeId, exc));
      });
  }


  /**
   * Führt die update-Methode async aus und führt ein dispatch des zugehörigen Kommandos durch.
   *
   * @param {T} item
   *
   * @memberOf ServiceRequests
   */
  public update(item: T): void {
    this.store.dispatch(new UpdatingItemCommand(this._storeId, item));

    this.service.update(item).subscribe(
      (elem) => {
        this.store.dispatch(new ItemUpdatedCommand(this._storeId, elem));
      },
      (exc: IException) => {
        this.store.dispatch(new ErrorCommand(this._storeId, exc));
      });
  }

  /**
   * Führt die update-Methode aus und führt ein dispatch des zugehörigen Kommandos durch.
   *
   * @param {T} item
   *
   * @memberOf ServiceRequests
   */
  public updateSync(item: T): void {
    this.service.update(item).subscribe(
      (elem) => {
        this.store.dispatch(new ItemUpdatedCommand(this._storeId, elem));
      },
      (exc: IException) => {
        this.store.dispatch(new ErrorCommand(this._storeId, exc));
      });
  }


  /**
   * Führt die delete-Methodes async aus und führt ein dispatch des zugehörigen Kommandos durch.
   *
   * @param {TId} id
   *
   * @memberOf ServiceRequests
   */
  public delete(id: TId): void {
    this.store.dispatch(new DeletingItemCommand(this._storeId, id));

    this.service.delete(id).subscribe(
      (result) => {
        this.store.dispatch(new ItemDeletedCommand(this._storeId, result.id));
      },
      (exc: IException) => {
        this.store.dispatch(new ErrorCommand(this._storeId, exc));
      });
  }

  /**
   * Führt die delete-Methodes aus und führt ein dispatch des zugehörigen Kommandos durch.
   *
   * @param {TId} id
   *
   * @memberOf ServiceRequests
   */
  public deleteSync(id: TId): void {
    this.service.delete(id).subscribe(
      (result) => {
        this.store.dispatch(new ItemDeletedCommand(this._storeId, result.id));
      },
      (exc: IException) => {
        this.store.dispatch(new ErrorCommand(this._storeId, exc));
      });
  }


  public getStoreState<T extends IEntity<TId>, TId>(storeId: string): IServiceState<T, TId> {
    return this.store.getState<IServiceState<T, TId>>(storeId);
  }

  public getEntityId(item: T): TId {
    return this._service.getEntityId(item);
  }

  public getModelClassName(): string {
    return this._service.getModelClassName();
  }

  protected get service(): TService {
    return this._service;
  }

  protected get store(): Store {
    return this._store;
  }
}