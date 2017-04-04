// -------------------------------------- logging --------------------------------------------
// Logging
import { using } from '../base/disposable';
import { levels } from '../diagnostics/level';
import { getLogger } from '../diagnostics/logger';
// tslint:disable-next-line:no-unused-variable
import { ILogger } from '../diagnostics/logger.interface';
import { XLog } from '../diagnostics/xlog';
// -------------------------------------- logging --------------------------------------------


import { CustomSubject, PublisherSubscriber } from '../base/publisherSubscriber';

import { ICommand } from './command.interface';


/**
 * Realisiert einen CommandStore, der
 * - einen speziellen Status hält
 * - Kommandos dispatched
 * - eine Subscription für Statusupdates ermöglicht.
 *
 * @export
 * @class CommandStore
 * @template T
 */
export class CommandStore<T> {
  protected static readonly logger = getLogger(CommandStore);

  private _channel: string;
  private pubSub: PublisherSubscriber = new PublisherSubscriber();
  private state: T;

  constructor(private _name: string, initialState: T) {
    using(new XLog(CommandStore.logger, levels.INFO, 'ctor'), (log) => {
      this.state = initialState;
      this._channel = '$$' + _name + '$$';
      log.log(`name = ${this._name}, initialState = ${JSON.stringify(initialState)}`);
    });
  }

  /**
   * Liefert den Storenamen
   *
   * @readonly
   * @type {string}
   * @memberOf CommandStore
   */
  public get name(): string {
    return this._name;
  }

  /**
   * Liefert den Status
   *
   * @returns {T}
   *
   * @memberOf CommandStore
   */
  public getState(): T {
    return this.state;
  }

  /**
   * Für ein Dispatch des Kommandos @param{command} aus -> Kommandoausführung, Statusupdate
   *
   * @param {ICommand<any>} command
   *
   * @memberOf CommandStore
   */
  public dispatch(command: ICommand<any>) {
    using(new XLog(CommandStore.logger, levels.INFO, 'dispatch'), (log) => {
      log.log(`command = ${command.constructor.name}: ${JSON.stringify(command)}`);

      this.state = command.execute(this.state);
      this.pubSub.publish(this._channel, command);
    });
  }

  /**
   * Liefert ein Subject für eine folgende Subscription.
   *
   * @returns {CustomSubject<any>}
   *
   * @memberOf CommandStore
   */
  public subject(): CustomSubject<any> {
    return this.pubSub.subscribe(this._channel);
  }
}