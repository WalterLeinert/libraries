// -------------------------- logging -------------------------------
// tslint:disable-next-line:no-unused-variable
import { getLogger, ILogger, levels, using, XLog } from '@fluxgate/platform';
// -------------------------- logging -------------------------------

import { Assert, CustomSubject, Dictionary, PublisherSubscriber } from '@fluxgate/core';

import { ICommand } from './commands/command.interface';


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
  private _children: Dictionary<string, CommandStore<any>> = new Dictionary<string, CommandStore<any>>();

  constructor(private _name: string, initialState: T, private _parent?: CommandStore<T>) {
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

  public get parent(): CommandStore<T> {
    return this._parent;
  }

  public addChild(child: CommandStore<T>) {
    Assert.notNull(child);
    this._children.set(child.name, child);
  }

  public containsChild(storeId: string): boolean {
    Assert.notNullOrEmpty(storeId);
    return this._children.containsKey(storeId);
  }

  public getChild(storeId: string): CommandStore<T> {
    Assert.notNullOrEmpty(storeId);
    return this._children.get(storeId);
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
  public dispatch(command: ICommand<T>) {
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