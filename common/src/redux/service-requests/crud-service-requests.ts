import { Assert, IException, IToString } from '@fluxgate/core';

// -------------------------------------- logging --------------------------------------------
// tslint:disable-next-line:no-unused-variable
import { getLogger, ILogger, levels, using, XLog } from '@fluxgate/platform';
// -------------------------------------- logging --------------------------------------------

import { IEntity } from '../../model/entity.interface';
import { IService } from '../../model/service/service.interface';
import {
  CreatingItemCommand, DeletingItemCommand, ErrorCommand,
  FindingItemByIdCommand, FindingItemsCommand,
  ItemCreatedCommand, ItemDeletedCommand, ItemFoundByIdCommand, ItemsFoundCommand,
  ItemUpdatedCommand, ServiceCommand, UpdatingItemCommand
} from '../command';
import { ICrudServiceState } from '../state/crud-service-state.interface';
import { ServiceRequestStates } from '../state/service-request-state';
import { Store } from '../store';
import { CommandStore } from '../store/command-store';
import { ICrudServiceRequests } from './crud-service-requests.interface';
import { ServiceRequests } from './service-requests';


/**
 * Modelliert CRUD-Operationen über ServiceRequests und Rest-API.
 * Führt ein dispatch der jeweiligen Kommandos durch.
 *
 * @export
 * @class CrudServiceRequests
 * @template T
 * @template TId
 * @template TService
 */
export class CrudServiceRequests<T extends IEntity<TId>, TId extends IToString,
  TService extends IService<T, TId>> extends ServiceRequests implements ICrudServiceRequests<T, TId> {
  protected static readonly logger = getLogger(CrudServiceRequests);


  public static readonly INITIAL_STATE: ICrudServiceState<any, any> = {
    ...ServiceRequests.INITIAL_STATE,
    items: [],
    item: null,
    deletedId: null
  };


  public constructor(storeId: string | CommandStore<any>, private _service: TService,
    store: Store, parentStoreId?: string) {
    super(storeId, store, parentStoreId);
  }


  /**
   * Führt die update-Methode async aus und führt ein dispatch des zugehörigen Kommandos durch.
   *
   * @param {T} item
   *
   * @memberOf ServiceRequests
   */
  public create(item: T): Promise<ICrudServiceState<T, TId>> {
    const rval = new Promise<ICrudServiceState<T, TId>>((resolve, reject) => {

      this.subject(this.storeId).subscribe((command) => {
        this.onStoreUpdated(command);
      });

      this.dispatch(new CreatingItemCommand(this, item));

      this.service.create(item).subscribe(
        (elem) => {
          this.dispatch(new ItemCreatedCommand(this, elem, resolve, reject));
        },
        (exc: IException) => {
          this.dispatch(new ErrorCommand(this, exc, resolve, reject));
        });

    });

    return rval;
  }


  /**
   * Führt die find-Methode async aus und führt ein dispatch des zugehörigen Kommandos durch.
   * @param {boolean} useCache - falls true, werden nur die Daten aus dem State übernommen; sonst Servercall
   * @memberOf ServiceRequests
   */
  public find(useCache: boolean = false): void {
    const state = this.getCrudState(this.storeId);

    this.dispatch(new FindingItemsCommand(this));

    const finder = () => {
      this.service.find().subscribe(
        (items) => {
          this.dispatch(new ItemsFoundCommand(this, items));
        },
        (exc: IException) => {
          this.dispatch(new ErrorCommand(this, exc));
        });
    };

    if (useCache) {
      if (state.state === ServiceRequestStates.UNDEFINED) {
        finder();

      } else {
        // items aus dem State liefern
        this.dispatch(new ItemsFoundCommand(this, [...state.items]));
      }
    } else {
      finder();
    }
  }


  public findById(id: TId): void {
    this.dispatch(new FindingItemByIdCommand(this, id));

    this.service.findById(id).subscribe(
      (elem) => {
        this.dispatch(new ItemFoundByIdCommand(this, elem));
      },
      (exc: IException) => {
        this.dispatch(new ErrorCommand(this, exc));
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
    this.dispatch(new UpdatingItemCommand(this, item));

    this.service.update(item).subscribe(
      (elem) => {
        this.dispatch(new ItemUpdatedCommand(this, elem));
      },
      (exc: IException) => {
        this.dispatch(new ErrorCommand(this, exc));
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
    this.dispatch(new DeletingItemCommand(this, id));

    this.service.delete(id).subscribe(
      (result) => {
        this.dispatch(new ItemDeletedCommand(this, result.id));
      },
      (exc: IException) => {
        this.dispatch(new ErrorCommand(this, exc));
      });
  }


  public getCrudState(storeId: string): ICrudServiceState<T, TId> {
    return super.getStoreState(storeId) as ICrudServiceState<T, TId>;
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


  protected onStoreUpdated<T extends IEntity<TId>, TId>(command: ServiceCommand<T, TId>): void {
    Assert.notNull(command);

    using(new XLog(CrudServiceRequests.logger, levels.INFO, 'onStoreUpdated', `class: ${this.constructor.name}`),
      (log) => {
        log.log(`command = ${command.constructor.name}: ${command.toString()}`);

        const state = this.getStoreState(command.storeId);
        if (state.error) {
          log.error(`${state.error}`);
        }

      });
  }

}