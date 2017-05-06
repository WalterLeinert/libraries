import { Injectable } from '@angular/core';

import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Subject } from 'rxjs/Subject';

// -------------------------------------- logging --------------------------------------------
// tslint:disable-next-line:no-unused-variable
import { getLogger, ILogger, levels, using, XLog } from '@fluxgate/platform';
// -------------------------------------- logging --------------------------------------------

// Fluxgate
import {
  CurrentItemSetCommand, CurrentUserStore, ICurrentItemServiceState, IEntity, IServiceState,
  IUser, ServiceCommand, SettingCurrentItemCommand, Store
} from '@fluxgate/common';
import { Assert } from '@fluxgate/core';

import { APP_STORE } from '../redux/app-store';
import { AppInjector } from './appInjector.service';

/**
 * Service zum Benachrichtigen aller Listener, falls der aktuelle User sich ändert (login, logoff, etc.)
 *
 * Der Service arbeitet mit Hilfe des @see{CurrentUserStore}; Komponenten wie @see{LoginComponent} setzen den
 * currentUser.
 */
@Injectable()
export class CurrentUserService {
  protected static readonly logger = getLogger(CurrentUserService);

  private _subject: Subject<IUser> = new BehaviorSubject(null);
  private _store: Store;

  constructor() {
    this._store = AppInjector.instance.getInstance<Store>(APP_STORE);

    this._store.subject(CurrentUserStore.ID).subscribe((command) => {
      this.onStoreUpdated(command);
    });
    this.updateUserState();
  }


  public getSubject(): Subject<IUser> {
    return this._subject;
  }


  /**
   * Liefert den aktuell angemeldeten User.
   *
   * @protected
   * @returns {IUser}
   *
   * @memberOf CoreComponent
   */
  public getCurrentUser(): IUser {
    const state = this.getStoreState<ICurrentItemServiceState<IUser, number>>(CurrentUserStore.ID);
    return state.currentItem;
  }


  /**
   * "virtuelle" Methode; muss in konkreten Klassen überschrieben werden, um die entsprechenden Statusupdates
   * mitzubekommen.
   *
   * @template T
   * @template TId
   * @param {ServiceCommand<T, TId>} value
   *
   * @memberOf CoreComponent
   */
  private onStoreUpdated<T extends IEntity<TId>, TId>(command: ServiceCommand<T>): void {
    Assert.notNull(command);

    using(new XLog(CurrentUserService.logger, levels.INFO, 'onStoreUpdated', `class: ${this.constructor.name}`),
      (log) => {
        log.log(`command = ${command.constructor.name}: ${command.toString()}`);

        const state = this.getStoreState(command.storeId);
        if (state.error) {
          log.error(`${state.error}`);
        }

        if (command.storeId === CurrentUserStore.ID && command instanceof CurrentItemSetCommand) {
          this.updateUserState(command);
        }
      });
  }


  /**
   * Liefert den Store-Status für die Id @param{storeId};
   *
   * @protected
   * @template T
   * @template TId
   * @param {string} storeId
   * @returns {IServiceState<T, TId>}
   *
   * @memberOf CoreComponent
   */
  private getStoreState<TState extends IServiceState>(storeId: string): TState {
    return this._store.getState(storeId) as TState;
  }


  /**
   * Benachrichtigt alle Listener, immer wenn sich der aktuelle/angemeldete User ändert.
   *
   * @private
   *
   * @memberOf CoreComponent
   */
  private updateUserState(command?: ServiceCommand<IUser>) {
    if (command instanceof SettingCurrentItemCommand) {
      //
      // Store bei User-Wechsel immer zurücksetzen, damit neuer User nicht Daten des vorherigen Users sehen kann
      //
      this._store.reset();
    }

    if (command instanceof CurrentItemSetCommand) {
      this._subject.next(this.getCurrentUser());
    }
  }
}