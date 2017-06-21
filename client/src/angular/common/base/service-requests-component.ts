// import { Injector, ReflectiveInjector } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';


// -------------------------------------- logging --------------------------------------------
// tslint:disable-next-line:no-unused-variable
import { getLogger, ILogger, levels, using, XLog } from '@fluxgate/platform';
// -------------------------------------- logging --------------------------------------------


// Fluxgate
import {
  CrudServiceRequests,
  IServiceRequests, IServiceState, ItemCreatedCommand,
  ItemDeletedCommand, ItemUpdatedCommand, ServiceCommand
} from '@fluxgate/common';
import { Assert, NotSupportedException, Types } from '@fluxgate/core';

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
export abstract class ServiceRequestsComponent<T, TServiceRequests extends IServiceRequests>
  extends ExtendedCoreComponent {
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

    //
    // z.B. bei Verwendung in AutoformComponent ist zu diesem Zeitpunkt _serviceRequests noch undefiniert und
    // wird erst über @see{setServiceRequests} gesetzt.
    //
    if (this._serviceRequests) {
      this.setupServiceRequests();
    }
  }

  /**
   * Liefert true, falls keine Änderungen an den Daten vorliegen oder diese invalid sind.
   * Zur Verwendung der disabled-Steuerung eines Save-Buttons.
   *
   * @returns {boolean}
   *
   * @memberof ServiceRequestsComponent
   */
  public isSaveDisabled(): boolean {
    return !(this.hasChanges() && this.isValid());
  }

  /**
   * Liefert true, falls im GUI ein Delete-Button disabled werden soll.
   *
   * @returns {boolean}
   *
   * @memberof ServiceRequestsComponent
   */
  public isDeleteDisabled(): boolean {
    return false;
  }


  /**
   * Löscht das Item @param{item}.
   *
   * Ist _serviceRequests keine Instanz von CrudServiceRequests, wird eine Exception geworfen.
   *
   * Ist _serviceRequests eine Instanz von @see{StatusServiceRequests}, wird nur das deleted-Flag
   * im Entity-Status gesetzt; ansonsten wird das Item komplett gelöscht.
   *
   * @protected
   * @param {T} item
   * @param {boolean} setDeleted
   *
   * @memberof ServiceRequestsComponent
   */
  protected deleteItem(item: T, action?: () => void) {
    if (!(this._serviceRequests instanceof CrudServiceRequests)) {
      throw new NotSupportedException();
    }

    this._serviceRequests.delete(item).subscribe((result) => {
      // -> onStoreUpdated

      if (action) {
        action();
      }
    });
  }


  /**
   * Liefert @param{item} als zu selektierendes Item oder (falls item undefined) das erste Item
   * aus der Liste @param{items}.
   *
   * @protected
   * @param {T[]} items - Itemliste
   * @param {T} item - zu selektierendes Item oder undefined
   *
   * @memberof ServiceRequestsComponent
   */
  protected selectItem(items: T[], item?: T): T {
    Assert.notNull(items);

    let currentItem;
    if (item) {
      currentItem = item;
    } else {
      currentItem = items.length > 0 ? items[0] : null;
    }

    return currentItem;
  }


  protected onStoreUpdatedGlobal<T>(command: ServiceCommand<T>): void {
    using(new XLog(ServiceRequestsComponent.logger, levels.INFO, 'onStoreUpdatedGlobal',
      `class: ${this.constructor.name}`), (log) => {
        super.onStoreUpdatedGlobal(command);

        log.log(`command = ${command.constructor.name}: ${command.toString()}`);

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

  protected onStoreUpdated<T>(command: ServiceCommand<T>): void {
    super.onStoreUpdated(command);
  }


  /**
   * Liefert den Store-State für den @see{CommandStore} der serviceRequests.
   */
  protected getState<TState extends IServiceState>(): TState {
    return this.getStoreState<TState>(this.storeId);
  }

  /**
   * Liefert den Store-State für den die angegebene @param{storeId}.
   */
  protected getStoreState<TState extends IServiceState>(storeId: string): TState {
    return super.getStoreState<TState>(storeId);
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
   * Liefert die zugehörigen ServiceRequests
   *
   * @readonly
   * @protected
   * @type {TService}
   * @memberOf ServiceRequestsComponent
   */
  protected get serviceRequests(): TServiceRequests {
    return this._serviceRequests;
  }


  /**
   * setzt die ServiceRequests-Instanz
   *
   * @protected
   * @param {TServiceRequests} serviceRequests
   *
   * @memberof ServiceRequestsComponent
   */
  protected setServiceRequests(serviceRequests: TServiceRequests) {
    Assert.that(!Types.isPresent(this._serviceRequests));

    this._serviceRequests = serviceRequests;
    this.setupServiceRequests();
  }


  /**
   * registriert die ServiceRequests-Instanz für Store-Updates
   *
   * @protected
   * @param {TServiceRequests} serviceRequests
   *
   * @memberof ServiceRequestsComponent
   */
  private setupServiceRequests() {
    Assert.notNull(this._serviceRequests);

    //
    // globale Subscription (für zentrale Infomeldungen) nur einmal pro Store registrieren
    //
    if (!ServiceRequestsComponent.hasStoreSubscription(this._serviceRequests.storeId)) {
      ServiceRequestsComponent.addStoreSubscription(this._serviceRequests.storeId);

      this.getStoreSubject(this._serviceRequests.storeId).subscribe((command) => {
        this.onStoreUpdatedGlobal(command);
      });
    }

    this.subscribeToStore(this._serviceRequests.storeId);
  }

}