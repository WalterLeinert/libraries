// import { Injector, ReflectiveInjector } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';


// -------------------------------------- logging --------------------------------------------
// tslint:disable-next-line:no-unused-variable
import { getLogger, ILogger, levels, using, XLog } from '@fluxgate/platform';
// -------------------------------------- logging --------------------------------------------


// Fluxgate
import {
  IServiceRequests, IServiceState, ItemCreatedCommand,
  ItemDeletedCommand, ItemUpdatedCommand, ServiceCommand
} from '@fluxgate/common';
import { Dictionary } from '@fluxgate/core';

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
  private static serviceRequestsSubscriptions: Set<string> = new Set<string>();


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
    // Subscription nur einmal pro Store registrieren
    //
    if (!ServiceRequestsComponent.serviceRequestsSubscriptions.has(this._serviceRequests.storeId)) {
      ServiceRequestsComponent.serviceRequestsSubscriptions.add(this._serviceRequests.storeId);

      const subscription = this.getStoreSubject(this._serviceRequests.storeId).subscribe((command) => {
        this.onStoreUpdatedGlobal(command);
      });
    }

    this.subscribeToStore(this._serviceRequests.storeId);
  }

  protected onStoreUpdatedGlobal<T>(command: ServiceCommand<T>): void {
    using(new XLog(ServiceRequestsComponent.logger, levels.INFO, 'onStoreUpdatedGlobal',
      `class: ${this.constructor.name}`), (log) => {
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

}