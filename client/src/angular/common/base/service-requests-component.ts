// import { Injector, ReflectiveInjector } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import 'rxjs/add/observable/of';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/map';


// -------------------------------------- logging --------------------------------------------
// tslint:disable-next-line:no-unused-variable
import { getLogger, ILogger, levels, using, XLog } from '@fluxgate/platform';
// -------------------------------------- logging --------------------------------------------


// Fluxgate
import {
  IEntity, IExtendedCrudServiceRequests, IExtendedCrudServiceState, ItemCreatedCommand,
  ItemDeletedCommand, ItemUpdatedCommand, ServiceCommand
} from '@fluxgate/common';
import { MessageService } from '../../services/message.service';
import { ExtendedCoreComponent } from './extended-core.component';


/**
 * Basisklasse (Komponente) für alle GUI-Komponenten mit @see{Router}, @see{ActivatedRoute},
 * @see{MessageService} und einer @see{ServiceRequests}-Instanz.
 *
 * @export
 * @class ServiceRequestComponent
 * @implements {OnInit}
 * @template TService - der konkrete Service
 */
export abstract class ServiceRequestsComponent<T extends IEntity<TId>, TId, TServiceRequests
  extends IExtendedCrudServiceRequests<T, TId>> extends ExtendedCoreComponent {
  protected static readonly logger = getLogger(ServiceRequestsComponent);


  /**
   * Creates an instance of ServiceRequestComponent.
   *
   * @param {Router} _router - der zugehörige Router
   * @param {ActivatedRoute} _route - die aktivierte Route
   * @param {*} _service - der zugehörige Service
   *
   * @memberOf ServiceRequestComponent
   */
  protected constructor(router: Router, route: ActivatedRoute, messageService: MessageService,
    private _serviceRequests: TServiceRequests) {
    super(router, route, messageService);

    this.subscribeToStore(this._serviceRequests.storeId);
  }


  public createItem(item: T) {
    this._serviceRequests.create(item);
  }

  /**
   * Führt die find-Methode der ServiceRequests async aus.
   *
   * @param {boolean} useCache - falls true, werden nur die Daten aus dem State übernommen; sonst Servercall
   */
  public findItems(useCache: boolean = false): void {
    this._serviceRequests.find(useCache);
  }

  public findItemById(id: TId) {
    this._serviceRequests.findById(id);
  }


  public updateItem(item: T) {
    this._serviceRequests.update(item);
  }

  public deleteItem(id: TId) {
    this._serviceRequests.delete(id);
  }

  public setCurrentItem(item: T) {
    this._serviceRequests.setCurrent(item);
  }



  protected onStoreUpdated<T extends IEntity<TId>, TId>(command: ServiceCommand<T, TId>): void {
    super.onStoreUpdated(command);

    using(new XLog(ServiceRequestsComponent.logger, levels.INFO, 'onStoreUpdated',
      `class: ${this.constructor.name}`), (log) => {
        log.log(`command = ${command.constructor.name}: ${JSON.stringify(command)}`);

        const state = super.getStoreState(command.storeId);
        if (state.error) {
          this.handleError(state.error);
        } else if (command instanceof ItemCreatedCommand) {
          this.addSuccessMessage('Record created.');
        } else if (command instanceof ItemUpdatedCommand) {
          this.addSuccessMessage('Record updated.');
        } else if (command instanceof ItemDeletedCommand) {
          this.addSuccessMessage('Record deleted.');
        }
      });
  }


  /**
   * Liefert den Store-State für den @see{CommandStore} der serviceRequests.
   */
  protected getState(): IExtendedCrudServiceState<T, TId> {
    return this.getStoreState(this.storeId);
  }

  /**
   * Liefert den Store-State für den die angegebene @param{storeId}.
   */
  protected getStoreState(storeId: string): IExtendedCrudServiceState<T, TId> {
    return super.getStoreState<IExtendedCrudServiceState<T, TId>>(storeId);
  }

  /**
   * Liefert die storeId der zugehörigen ServiceRequests.
   *
   * @readonly
   * @protected
   * @type {string}
   * @memberOf ServiceRequestsComponent
   */
  protected get storeId(): string {
    return this._serviceRequests.storeId;
  }


  /**
   * Liefert den zugehörigen Service
   *
   * @readonly
   * @protected
   * @type {TService}
   * @memberOf ServiceRequestComponent
   */
  // protected get serviceRequests(): TServiceRequests {
  //   return this._serviceRequests;
  // }


  /**
   * Liefert die Entity-Id für den Navigationspfad.
   * Format: <Entity-Classname>-<Item-Id>
   */
  protected formatGenericId(item: any): string {
    return `${this._serviceRequests.getModelClassName() + '-' + this._serviceRequests.getEntityId(item)}`;
  }

}